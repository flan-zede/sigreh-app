export interface PatchInterface {
    op: string;
    path: string;
    from?: string;
    value: string;
}
