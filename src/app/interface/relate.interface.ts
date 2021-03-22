export interface ManyToManyInterface {
    table: string;
    id: number;
    add: boolean;
}

export interface OneToManyInterface {
    table: string;
    value: any;
}
