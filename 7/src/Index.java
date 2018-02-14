import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.Version;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.text.ParseException;

public class Index {


    public Index() {
    }

    public static void main(String[] args) throws IOException, ParseException {

        StandardAnalyzer analyzer;
        FSDirectory index;
        IndexWriterConfig config;

        String path = "/Users/krystiankrzywda/projects/nodejs/eksplo/pages";
        File folder = new File(path);
        File[] listOfFiles = folder.listFiles();
        BufferedReader reader = null;

        File fileLucene = new File("/Users/krystiankrzywda/projects/EDWI_SEARCH/untitled/index.lucene");
        // index.lucene
        // /Users/krystiankrzywda/projects/EDWI/index.lucene
        analyzer = new StandardAnalyzer(Version.LUCENE_40);
        config = new IndexWriterConfig(Version.LUCENE_40, analyzer);

        index = FSDirectory.open(fileLucene);
        IndexWriter w = new IndexWriter(index, config);


        File file;
        if(listOfFiles == null) {
            return;
        }
        int x = 0;
        for (int i = 0; i < listOfFiles.length; i++) {
            if (listOfFiles[i].isFile()) {
                // System.out.println("File " + listOfFiles[i].getName());

                file = new File(path + "/" + listOfFiles[i].getName());

                try {
                    reader = new BufferedReader(new FileReader(file));
                    String text = null;

                    int lineNumber = 0;
                    String title = "";
                    String url = "";
                    String body = " ";
                    while ((text = reader.readLine()) != null) {
                        if(lineNumber == 0) {
                            title = text;
                        }
                        else if(lineNumber == 1) {
                            url = text;
                        }
                        else {
                            body += text;
                        }
                        lineNumber++;
                    }
                    if(title.length() > 0 && url.length() > 0 && body.length() > 0) {
                        System.out.println("OK      " + listOfFiles[i].getName());
                        addDoc(w, title, url, body, listOfFiles[i].getName());
                    }
                    else {
                        System.out.println("NOT OK      " + listOfFiles[i].getName());
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                } finally {
                    try {
                        if (reader != null) {
                            reader.close();
                        }
                    } catch (IOException ignored) {
                    }
                }

            }
        }

        System.out.println("Len " + listOfFiles.length + " " + x);
        w.close();

    }

    private static void addDoc(IndexWriter w, String title, String url, String text, String fileName) throws IOException {
        Document doc = new Document();
        doc.add(new TextField("title", title, Field.Store.YES));
        url = url.replace("http://", "");
        url = url.replace("https://", "");
        doc.add(new TextField("url", url, Field.Store.YES));
        doc.add(new TextField("text", text, Field.Store.YES));
        doc.add(new TextField("filename", fileName, Field.Store.YES));
        w.addDocument(doc);
    }
}
