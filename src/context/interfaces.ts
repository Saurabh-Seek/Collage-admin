interface IMongoId{
    _id:string
}
export interface IUser extends IMongoId{
    firstName: string,
    lastName: string,
    email: string,
    phone: number,
}

export interface ICategory extends IMongoId{
    "name": string,
}

export interface ICourse extends IMongoId{
    "slug": string,
    "title": string,
    "desc": string,
    "rate": number,
    "price": number,
    category:ICategory,
    createdBy:IUser,
    createdAt:string,
    updatedAt:string
}