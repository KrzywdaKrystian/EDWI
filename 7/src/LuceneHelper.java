import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.*;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.Version;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class LuceneHelper {

    private StandardAnalyzer analyzer;
    private FSDirectory index;
    private IndexWriterConfig config;

    public LuceneHelper() {

        // 0. Specify the analyzer for tokenizing text.
        //    The same analyzer should be used for indexing and searching
        analyzer = new StandardAnalyzer(Version.LUCENE_40);

        // 1. create the index
        File file = new File("/Users/krystiankrzywda/projects/EDWI_SEARCH/untitled/index.lucene");

        try {
            index = FSDirectory.open(file);
        } catch (IOException e) {
            e.printStackTrace();
        }

        config = new IndexWriterConfig(Version.LUCENE_40, analyzer);

    }

    public ResultsSearch findByText(SearchConfiguration searchConfiguration) throws IOException, ParseException {

        // http://www.lucenetutorial.com/lucene-query-syntax.html
        String querystr = searchConfiguration.getQuery();
        ResultsSearch resultsSearch = new ResultsSearch();
        // Query
        querystr = "";

        String[] splited = searchConfiguration.getTextQuery().split("\\s+");
        if(splited.length == 1) {
            if(searchConfiguration.isTitleChecked()) {
                querystr += "title:" + searchConfiguration.getTextQuery() + "*";
            }

            if(searchConfiguration.isUrlChecked()) {
                if(querystr.length() > 0) {
                    querystr += " OR ";
                }
                querystr += "url:" + searchConfiguration.getTextQuery() + "*";
            }

            if(searchConfiguration.isTextChecked()) {
                if(querystr.length() > 0) {
                    querystr += " OR ";
                }
                querystr += "text:" + searchConfiguration.getTextQuery() + "*";
            }
        }
        else {
            if(searchConfiguration.isTitleChecked()) {
                querystr += "title:\"" + searchConfiguration.getTextQuery() + "\"";
            }

            if(searchConfiguration.isUrlChecked()) {
                if(querystr.length() > 0) {
                    querystr += " OR ";
                }
                querystr += "url:\"" + searchConfiguration.getTextQuery() + "\"";
            }

            if(searchConfiguration.isTextChecked()) {
                if(querystr.length() > 0) {
                    querystr += " OR ";
                }
                querystr += "text:\"" + searchConfiguration.getTextQuery() + "\"";
            }
        }

        IndexReader reader = DirectoryReader.open(index);
        IndexSearcher searcher = new IndexSearcher(reader);

        resultsSearch = search(querystr, searcher);

        reader.close();

        return resultsSearch;
    }

    public ResultsSearch findByQuery(SearchConfiguration searchConfiguration) throws IOException, ParseException {

        IndexReader reader = DirectoryReader.open(index);
        IndexSearcher searcher = new IndexSearcher(reader);

        ResultsSearch resultsSearch = search(searchConfiguration.getQuery(), searcher);

        reader.close();

        return resultsSearch;
    }

    public ResultsSearch search(String querystr, IndexSearcher searcher) throws IOException {

        ResultsSearch resultsSearch = new ResultsSearch();
        System.out.println(querystr);
        Query query1 = null;
        try {
            QueryParser queryParser = new QueryParser(Version.LUCENE_40, "title", analyzer);
            queryParser.setDefaultOperator(QueryParser.Operator.AND);
            query1 = queryParser.parse(querystr);

        } catch (org.apache.lucene.queryparser.classic.ParseException e) {
            e.printStackTrace();
        }


        // Search
        int hitsPerPage = 10;
        TopScoreDocCollector collector = TopScoreDocCollector.create(hitsPerPage, false);
        searcher.search(query1, collector);
        ScoreDoc[] hits = collector.topDocs().scoreDocs;

        // Results
        List<String> results = new ArrayList<>();
        for (ScoreDoc hit : hits) {
            int docId = hit.doc;
            System.out.println(hit.toString());
            Document d = searcher.doc(docId);
            results.add(d.get("title") + "\n" + d.get("url") + "\n" + d.get("filename") + "\n\n");
        }
        resultsSearch.setResultsNumber(hits.length);
        resultsSearch.setResults(results);

        return resultsSearch;
    }
}
