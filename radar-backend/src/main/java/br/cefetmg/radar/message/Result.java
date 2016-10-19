package br.cefetmg.radar.message;

public class Result {
    private String result;
    private String description;
    
    public static final String OK = "OK";
    public static final String ERRO = "ERRO";
    public static final String USERNAME_EXISTS = "USERNAME_EXISTS";
    public static final String USERNAME_DONT_EXISTS = "USERNAME_DONT_EXISTS";
    public static final String EMAIL_OR_PASSWORD_WRONG = "EMAIL_OR_PASSWORD_WRONG";
    public static final String SHORT_USERNAME = "SHORT_USERNAME";
    public static final String SHORT_PASSWORD = "SHORT_PASSWORD";
    public static final String WRONG_GUID = "WRONG_GUID";
    public static final String EMAIL_DONT_EXIST = "EMAIL_DONT_EXIST";
    public static final String EMAIL_EXISTS = "EMAIL_EXISTS";
    public static final String TOO_YOUNG = "TOO_YOUNG";
    public static final String USER_DOESNT_EXISTS = "USER_DOESNT_EXISTS";
    public static final String INVALID_DATE = "INVALID_DATE";
    public static final String SERVICE_DOESNT_EXISTS = "SERVICE_DOESNT_EXISTS";
    public static final String NUMBER_OF_TRIES_EXCEEDED = "NUMBER_OF_TRIES_EXCEEDED";

    public Result(String result) {
        this.result = result;
        this.description = "";
    }
    public Result(String result, String description) {
        this.result = result;
        this.description = description;
    }
    public String getResult() {
        return result;
    }
    public void setResult(String result) {
        this.result = result;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    
}
