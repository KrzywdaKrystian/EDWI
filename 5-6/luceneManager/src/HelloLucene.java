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

public class HelloLucene {

    private StandardAnalyzer analyzer;
    private FSDirectory index;
    private IndexWriterConfig config;

    static String path = "Unzipper/unziped";

    public HelloLucene() {

    }


    public static File[] getFiles() {
        File folder = new File(path);
        return folder.listFiles();
    }

    public static void main(String[] args) throws IOException, ParseException {


        File fileLucene = new File("/Users/krystiankrzywda/projects/EDWI/index.lucene");
        StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_40);
        IndexWriterConfig config = new IndexWriterConfig(Version.LUCENE_40, analyzer);

        FSDirectory index = FSDirectory.open(fileLucene);
        IndexWriter w = new IndexWriter(index, config);


        File[] listOfFiles = getFiles();
        for (int i = 0; i < listOfFiles.length; i++) {

            try (BufferedReader br = new BufferedReader(new FileReader(path + "/" + listOfFiles[i].getName()))) {
                StringBuilder sb = new StringBuilder();
                String line = br.readLine();
                String title = "";

                while (line != null) {
                    if (title.length() > 0) {
                        sb.append(line.trim().replaceAll(" +", " "));
                        sb.append(System.lineSeparator());
                    } else {
                        if (line.length() > 5 && line.substring(0, 5).equals("Title")) {
                            title = line.substring(7, line.length());
                        }
                    }
                    line = br.readLine();
                }
                String body = sb.toString();
                if(title.length() > 0 && body.length() > 0) {
                    addDoc(w, title, body, listOfFiles[i].getName());
                }
                else {
                    System.out.println("[NOT Indexed] " + listOfFiles[i].getName());
                }
            }
        }

        w.close();
    }

    private static void addDoc(IndexWriter w, String title, String text, String fileName) throws IOException {
        Document doc = new Document();
        doc.add(new TextField("title", title, Field.Store.YES));
        doc.add(new TextField("text", text, Field.Store.YES));
        doc.add(new StringField("fileName", fileName, Field.Store.YES));
        w.addDocument(doc);
        System.out.println("[Indexed] " + fileName + " " + title);
    }
}
