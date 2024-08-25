import {Logger, OnModuleDestroy, OnModuleInit} from "@nestjs/common";
import {SchedulerRegistry} from "@nestjs/schedule";

export abstract class BaseChainTaskAbstract<C extends { chainId: number }> implements OnModuleInit, OnModuleDestroy {
    protected constructor(
        private readonly name: string,
        private readonly config: C[],
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly repeatSeconds: number = 30
    ) {
    }

    onModuleDestroy() {
        this.stopSchedule();
    }

    onModuleInit() {
        this.schedule().then();
    }

    private privateWrapperRun(configuration: C, initial: boolean): any {
        return setTimeout(async () => {
            try {
                await this.run(configuration);
            } catch (exp: any) {
                if (typeof exp.message === 'undefined' || !exp.message.startsWith("[LOCK_ERR]")) {
                    Logger.warn(`Failed to run ${this.name} task: ${exp?.stack}`);
                }
            } finally {
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

    protected abstract run(chainConfig: C): Promise<void>;
}