export const ErrorMessages = {
    LOGIN_NOT_FOUND:
        "User not found, either the email or username is misspelled or the profile is already deleted",
    NOT_REGISTERED: "You are not logged in or registered",
    INTERNAL_ERROR: "Internal server error. Try again later",
    USER_NOT_FOUND:
        "User not found. Either the user has deleted the profile or the given username is misspelled.",
    AVATAR_MISSING_FILE:
        "There is no file for your avatar attached. Please upload your image via a valid image form (jpeg, jpg or png).",
    ME_NOT_FOUND: "User not found. Your profile is already deleted",
    EMAIL_EXIST: "Email address already exists.",
    INVALID_EMAIL: "Invalid email address.",
    USERNAME_EXIST: "Username already exists.",
    EMAIL_NOT_FOUND: "Email not found.",
    USERNAME_NOT_FOUND: "Username not found.",
    INCORRECT_PASSWORD: "Passwords do not match.",
    LOGIN_MISSING: "Username/email and password are not submitted",
    DESTROY_COOKIE_ERROR:
        "Internal server error. Could not destory session cookie",
    MISMATCH_PASSWORD: "Password do not match. Try again.",
    NO_NEW_PASSWORD: "New password is not given",
    PW_TOO_WEAK:
        "Your given password is too weak. Use a combination of at least one symbol, one uppercase letter and the length must be greater than 8!",
    PW_WEAK:
        "Your given password is weak. Use a combination at minimum of one symbol, one uppercase letter and the lenth must be greater than 8.",
    ID_POST_MISSING: (id: string) => `Post '${id}' not found.`,
    POST_NO_ID: "ID of post missing.",
    POST_NOT_FOUND: "Post not found.",
    POST_NOT_TO_USER: (id: string) => `Post '${id}' does not belong to you.`,
    COMMENT_NO_POST_ID: `No post id to comment provided.`,
    COMMENT_NO_POST: "Post to comment not found.",
    COMMENT_NO_BODY: "Comment body request is missing or invalid.",
    COMMENT_NO_COMMENT_ID: "Comment ID not provided.",
    COMMENT_NOT_FOUND: (id: string) => `Comment '${id}' not found.`,
    COMMENT_PAGE_QUERY: "Page query is not a number.",
    COMMENT_LIMIT_QUERY: "Limit query is not a number",
    BAD_REQUEST_NO_USERNAME: "You forgot to submit the user's profile",
    INVALID_KINGDOM: "Invalid kingdom types.",
    PREDICTION_ERROR: "Prediction error. Something went wrong with the prediction service.",
    NO_IMAGES: "No images attached",
    COUNT_MISMATCH: "The submitted images aren't the same length as the submitted kingdom types.",
};

export const SuccessMessages = {
    LOGOUT: "Successfully logged out.",
    PROFILE_DELETED: "Profile deleted.",
    PROFILE_EDITED: "Profile successfully edited.",
};
