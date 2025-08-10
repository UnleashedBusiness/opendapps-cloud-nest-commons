import {Logger, OnModuleDestroy, OnModuleInit} from "@nestjs/common";
import {SchedulerRegistry} from "@nestjs/schedule";
import {CacheService} from "../cache/cache.service.js";

export abstract class BaseTaskAbstract implements OnModuleInit, OnModuleDestroy {
    private static readonly TASK_LOCKS_NAMESPACE_PREFIX: string = "multi-instance-caching-locks";

    private scheduled = false;

    protected constructor(
        private readonly name: string,
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly repeatSeconds: number = 60,
        private readonly lockCaching: CacheService | undefined = undefined,
        private readonly lockServiceName: string | undefined = undefined,
        private readonly lockTimeout: number = 300,
    ) {
    }

    onModuleDestroy() {
        this.stopSchedule();
    }

    onModuleInit() {
        if (!this.scheduled) {
            this.scheduled = true;
            this.schedule().then();
        }
    }

    public async schedule(): Promise<void> {
        const taskName = `task-${this.name}-`;
        if (this.schedulerRegistry.doesExist("timeout", taskName)) return;

        try {
            Logger.debug(`Scheduling ${this.name} on task....`);

            this.schedulerRegistry.addTimeout(
                taskName,
                this.privateWrapperRun(true),
            );
        } catch (e) {
            Logger.error(`Failed to schedule ${this.name} task! Error: ${e}`);
        }
    }

    public stopSchedule(): void {
        const jobName = `task-${this.name}`;
        if (jobName in this.schedulerRegistry.getIntervals()) {
            this.schedulerRegistry.deleteInterval(jobName);
        }
    }

    private privateWrapperRun(initial: boolean): any {
        return setTimeout(async () => {
            const lockingKey = await this.lockIfApplicable();
            try {
                if (lockingKey === undefined) {
                    Logger.debug(`Skipping run because task [${this.name}] did not manage to grab locking.`);
                } else {
                    await this.run();
                }
            } catch (exp: any) {
                if (typeof exp.message === 'undefined' || !exp.message.startsWith("[LOCK_ERR]")) {
                    Logger.warn(`Failed to run ${this.name} task: ${exp?.stack}`);
                }
            } finally {
                await this.unlockIfApplicable(lockingKey);
                this.privateWrapperRun(false);
            }
        }, initial ? 1000 : this.repeatSeconds * 1000);
    }

    private async lockIfApplicable(): Promise<string | undefined> {
        const namespace = `${BaseTaskAbstract.TASK_LOCKS_NAMESPACE_PREFIX}_${this.lockServiceName}`;
        const cacheKey = `task-${this.name}-lock`;

        if (this.lockCaching === undefined || this.lockServiceName === undefined) {
            return cacheKey;
        }

        const now = new Date().valueOf();
        const locked = await this.lockCaching.isLocked<number>(namespace, cacheKey);
        if (locked) {
            const lockedSince = await this.lockCaching.get<number>(namespace, cacheKey);
            if (lockedSince + this.lockTimeout < now) {
                try {
                    await this.lockCaching.forceUnlock(namespace, cacheKey);
                } catch (e) {
                    return undefined;
                }
            } else {
                return undefined;
            }
        }

        await this.lockCaching.lock<number>(namespace, cacheKey, this.lockTimeout);
        try {
            await this.lockCaching.set<number>(namespace, cacheKey, now, 0);
            return cacheKey;
        } catch (e) {
            await this.lockCaching.unlock(namespace, cacheKey);
            return undefined;
        }
    }

    private async unlockIfApplicable(lockedKey: string): Promise<void> {
        const namespace = `${BaseTaskAbstract.TASK_LOCKS_NAMESPACE_PREFIX}_${this.lockServiceName}`;

        if (this.lockCaching === undefined || this.lockServiceName === undefined) {
            return;
        }

        try {
            await this.lockCaching.unlock(namespace, lockedKey);
        } catch (e) {}
    }

    protected abstract run(): Promise<void>;

}