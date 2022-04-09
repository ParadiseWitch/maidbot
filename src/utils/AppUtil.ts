import config from "../../config";


export const isAdmin = (uid: number) => config.admin.indexOf(uid) !== -1;
