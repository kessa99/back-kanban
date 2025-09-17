export declare class UserEntity {
    id: string;
    name: string;
    email: string;
    password: string;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
    private constructor();
    static create(props: {
        id: string;
        name: string;
        email: string;
        password: string;
        createdBy?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }): UserEntity;
}
