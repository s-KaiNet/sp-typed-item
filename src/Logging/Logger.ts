export abstract class Logger {
    public abstract error(err: any): void;
    public abstract warn(data: any): void;
    public abstract info(data: any): void;

    protected data2String(data: any): string {
        if (data instanceof Error) {
            return data.stack || data.message;
        }

        if (typeof data === 'string') {
            return data;
        }

        return JSON.stringify(data, null, 2);
    }
}
