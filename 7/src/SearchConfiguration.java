public class SearchConfiguration {

    private String query;
    private String textQuery;
    private boolean titleChecked;
    private boolean urlChecked;
    private boolean textChecked;

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getTextQuery() {
        return textQuery;
    }

    public void setTextQuery(String textQuery) {
        this.textQuery = textQuery;
    }

    public boolean isTitleChecked() {
        return titleChecked;
    }

    public void setTitleChecked(boolean titleChecked) {
        this.titleChecked = titleChecked;
    }

    public boolean isUrlChecked() {
        return urlChecked;
    }

    public void setUrlChecked(boolean urlChecked) {
        this.urlChecked = urlChecked;
    }

    public boolean isTextChecked() {
        return textChecked;
    }

    public void setTextChecked(boolean textChecked) {
        this.textChecked = textChecked;
    }
}
