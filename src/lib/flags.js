export const UserFlags = {
    system: 1 << 1,
    bot: 1 << 2,
    verifiedBot: 1 << 3,
    deleted: 1 << 4,
    terminated: 1 << 5,
    passwordExpired: 1 << 6,
    requireEmail: 1 << 7,
    requireMFA: 1 << 8
}

export const ApplicationFlags = {
    firstParty: 1 << 1,
    hasBot: 1 << 2
}

export const PostFlags = {
    bridged: 1 << 1,
    edited: 1 << 2,
    protected: 1 << 3,
    reputationBanned: 1 << 4
}

export const CommentFlags = {
    bridged: 1 << 1,
    edited: 1 << 2
}

export const ChannelFlags = {}

export const MessageFlags = {
    systemAlert: 1 << 1,
    bridged: 1 << 2,
    edited: 1 << 3
}

export const InfractionFlags = {
    automatic: 1 << 1,
    detectAlts: 1 << 2,
    poisonous: 1 << 3,
    blockAppeals: 1 << 4
}

export const AdminScopes = {
    accessNotes: 1 << 1,
    moderateUsers: 1 << 2,
    moderatePublicContent: 1 << 3,
    moderatePrivateChats: 1 << 4,
    moderateCommunities: 1 << 5,
    manageUsers: 1 << 6,
    manageNetworks: 1 << 7,
    manageApplications: 1 << 8,
    manageSystem: 1 << 9
}
