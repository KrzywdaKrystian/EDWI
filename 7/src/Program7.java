import org.apache.lucene.queryparser.classic.ParseException;

import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;

public class Program7 {
    private JPanel panel1;
    private JButton btnSearch;
    private JTextField textQuery;
    private JTextArea logArea;
    private JCheckBox titleCheck;
    private JCheckBox urlCheck;
    private JCheckBox textCheck;
    private JLabel resultsLabel;
    private JButton btnQuery;
    private JTextField textQuery2;

    private LuceneHelper luceneHelper;
    private ResultsSearch resultsSearch;
    private SearchConfiguration searchConfiguration;
    public Program7() {
        searchConfiguration= new SearchConfiguration();
        luceneHelper = new LuceneHelper();
        titleCheck.setSelected(true);
        btnSearch.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                try {
                    // lucene
                    try {
                        searchConfiguration.setTextQuery(textQuery.getText());
                        searchConfiguration.setTextChecked(textCheck.isSelected());
                        searchConfiguration.setTitleChecked(titleCheck.isSelected());
                        searchConfiguration.setUrlChecked(urlCheck.isSelected());

                        resultsSearch = luceneHelper.findByText(searchConfiguration);
                        StringBuilder str = new StringBuilder();
                        for(String s : resultsSearch.getResults()) {
                            str.append(s);
                        }
                        resultsLabel.setText("Wyników: " + resultsSearch.getResultsNumber());
                        logArea.setText(str.toString());
                    } catch (ParseException e1) {
                        e1.printStackTrace();
                    }
                } catch (IOException e1) {
                    e1.printStackTrace();
                }
            }
        });

        btnQuery.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                try {
                    // lucene
                    try {
                        searchConfiguration.setQuery(textQuery2.getText());

                        resultsSearch = luceneHelper.findByQuery(searchConfiguration);
                        StringBuilder str = new StringBuilder();
                        for(String s : resultsSearch.getResults()) {
                            str.append(s);
                        }
                        resultsLabel.setText("Wyników: " + resultsSearch.getResultsNumber());
                        logArea.setText(str.toString());
                    } catch (ParseException e1) {
                        e1.printStackTrace();
                    }
                } catch (IOException e1) {
                    e1.printStackTrace();
                }
            }
        });
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("Program");
        frame.setContentPane(new Program7().panel1);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.pack();
        frame.setSize(800, 600);

        frame.setVisible(true);
    }


}
