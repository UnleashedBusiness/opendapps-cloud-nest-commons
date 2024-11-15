import {Logger, OnModuleDestroy, OnModuleInit} from "@nestjs/common";
import {SchedulerRegistry} from "@nestjs/schedule";
import {CacheService} from "../cache/cache.service.js";
import {BlockchainDefinition} from "@unleashed-business/ts-web3-commons";

export abstract class BaseChainTaskAbstract<C extends { chainId: number }> implements OnModuleInit, OnModuleDestroy {
    private static readonly TASK_LOCKS_NAMESPACE_PREFIX: string = "multi-instance-caching-locks";

    private scheduled = false;

    protected constructor(
        private readonly name: string,
        private readonly config: C[],
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly repeatSeconds: number = 30,
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

    private privateWrapperRun(configuration: C, initial: boolean): any {
        return setTimeout(async () => {
            const lockingKey = await this.lockIfApplicable(configuration);
            if (lockingKey === undefined) {
                Logger.debug(`Skipping run because task [${this.name}] did not manage to grab locking.`)
            }

            try {
                await this.run(configuration);
            } catch (exp: any) {
                if (typeof exp.message === 'undefined' || !exp.message.startsWith("[LOCK_ERR]")) {
                    Logger.warn(`Failed to run ${this.name} task: ${exp?.stack}`);
                }
            } finally {
                await this.unlockIfApplicable(lockingKey);
                this.privateWrapperRun(configuration, false);
            }
        }, initial ? 1000 : this.repeatSeconds * 1000);
    }

    public async schedule(): Promise<void> {
        for (const configuration of this.config) {
            const taskName = `task-${this.name}-${configuration.chainId}`;
            if (this.schedulerRegistry.doesExist("timeout", taskName)) continue;

            try {
                Logger.debug(`Scheduling ${this.name} on chain ${configuration.chainId} task....`);
                this.schedulerRegistry.addTimeout(
                    taskName,
                    this.privateWrapperRun(configuration, true),
                );
            } catch (e) {
                Logger.error(`Failed to schedule ${this.name} task for chain ${configuration.chainId}! Error: ${e}`);
            }
        }
    }

    public stopSchedule(): void {
        for (const configuration of this.config) {
            const jobName = `task-${this.name}-${configuration.chainId}`;
            if (jobName in this.schedulerRegistry.getIntervals()) {
                this.schedulerRegistry.deleteInterval(jobName);
            }
        }
    }

    private async lockIfApplicable(configuration: C): Promise<string | undefined> {
        const namespace = `${BaseChainTaskAbstract.TASK_LOCKS_NAMESPACE_PREFIX}_${this.lockServiceName}`;
        const cacheKey = `task-${this.name}-${configuration.chainId}-lock`;

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
        const namespace = `${BaseChainTaskAbstract.TASK_LOCKS_NAMESPACE_PREFIX}_${this.lockServiceName}`;

        if (this.lockCaching === undefined || this.lockServiceName === undefined) {
            return;
        }

        try {
            await this.lockCaching.unlock(namespace, lockedKey);
        } catch (e) {}
    }

    protected abstract run(chainConfig: C): Promise<void>;
}