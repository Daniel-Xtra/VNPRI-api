import { IBaseInterface } from "../api/baseInterface";

export interface IUserModel extends IBaseInterface {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number: number;
    gender: "male" | "female";
    membership_type: "user" | "doctor" | "counsellor" | "admin" | "moderator";
    date_of_birth: string;
    email_verification_code: string;
    password_reset_code: string;
    verified: boolean;
    socket_id: string;
    auth_key: string;
    player_id: string;
    pass_updated: number;
    poll_count: number;
    getSubscription(): any;
    getProfile(): any;
    getSessions(): any;
    getVote(): any;
    getFollows(): any;
    getNotifications(): any;
    getSettings(): any;
    getDiaries(): any;
    addPoll(poll: any): any;
    addDiary(diary: any): any;
    setSubscription(sub: any): any;
    setSettings(settings: any): any;
}
