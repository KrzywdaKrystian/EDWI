import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopScoreDocCollector;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.Version;

import java.io.File;
import java.io.IOException;

public class LuceneHelper {

    private StandardAnalyzer analyzer;
    private FSDirectory index;
    private IndexWriterConfig config;

    public LuceneHelper() {

        // 0. Specify the analyzer for tokenizing text.
        //    The same analyzer should be used for indexing and searching
        analyzer = new StandardAnalyzer(Version.LUCENE_40);

        // 1. create the index
        File file = new File("/Users/krystiankrzywda/projects/EDWI/index.lucene");

        try {
            index = FSDirectory.open(file);
        } catch (IOException e) {
            e.printStackTrace();
        }

        config = new IndexWriterConfig(Version.LUCENE_40, analyzer);

    }

    public String queryForExample(String querystr) throws IOException {
        // 2. query

        // the "title" arg specifies the default field to use
        // when no field is explicitly specified in the query.
        querystr = "\\b(the|of|AND)\\b OR (title:\"" + querystr + "\") OR (text:\"" + querystr+"\")^1.5";
        Query q = null;
        try {
            q = new QueryParser(Version.LUCENE_40, "title", analyzer).parse(querystr);
        } catch (org.apache.lucene.queryparser.classic.ParseException e) {
            e.printStackTrace();
        }

        // 3. search
        int hitsPerPage = 1000;
        IndexReader reader = DirectoryReader.open(index);
        IndexSearcher searcher = new IndexSearcher(reader);
        TopScoreDocCollector collector = TopScoreDocCollector.create(hitsPerPage, true);
        searcher.search(q, collector);
        ScoreDoc[] hits = collector.topDocs().scoreDocs;

        String str = "";
        // 4. display results
        str += "Found " + hits.length + " hits.\n";
        for (int i = 0; i < hits.length; ++i) {
            int docId = hits[i].doc;
            Document d = searcher.doc(docId);
            str += ((i + 1) + ". " + d.get("fileName") + "\t" + d.get("title")) + '\n';
        }

        // reader can only be closed when there
        // is no need to access the documents any more.
        reader.close();
        return str;
    }
}
