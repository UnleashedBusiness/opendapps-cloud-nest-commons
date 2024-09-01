import {Logger, OnModuleDestroy, OnModuleInit} from "@nestjs/common";
import {SchedulerRegistry} from "@nestjs/schedule";

export abstract class BaseTaskAbstract implements OnModuleInit, OnModuleDestroy {
    private scheduled = false;

    protected constructor(
        private readonly name: string,
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly repeatSeconds: number = 60
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
        Logger.debug(`Scheduling ${this.name} task....`);

        try {
            await this.run();
        } catch (exp: any) {
            Logger.warn(`Failed to run initial ${this.name} task run: ${exp?.stack}`);
        } finally {
            this.schedulerRegistry.addInterval(
                `task-${this.name}`,
                setInterval(async () => this.run(), this.repeatSeconds * 1000),
            );
        }
    }

    public stopSchedule(): void {
        const jobName = `task-${this.name}`;
        if (jobName in this.schedulerRegistry.getIntervals()) {
            this.schedulerRegistry.deleteInterval(jobName);
        }
    }

    protected abstract run(): Promise<void>;

}