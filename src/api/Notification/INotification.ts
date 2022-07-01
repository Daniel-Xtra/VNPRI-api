import { IBaseInterface } from "../baseInterface";

export interface INotification extends IBaseInterface {
    // type any is used to prevent error on validation level
    message: any;
    context: any;
    triggered_by: any;
}

export interface ISettings extends IBaseInterface {
    all: boolean;
    post: boolean;
    post_comment: boolean;
    comment_reply: boolean;
    comment_like: boolean;
    poll_reaction: boolean;
    follow_post_comment: boolean;
    received_coins: boolean;
    direct_message: boolean;
}

export interface IPushData {
    headings: {
        en: string;
    };
    contents: {
        en: string;
    };
    data: any;
    subtitle: {
        en: string;
    };
    include_player_ids: string[];
}
export interface IPostPushData {
    headings: {
        en: string;
    };
    contents: {
        en: string;
    };
    data: any;
    subtitle: {
        en: string;
    };
    included_segments?: string[];
    include_player_ids?: string[];
}
