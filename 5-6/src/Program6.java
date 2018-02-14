import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;

public class Program6 {
    private JPanel panel1;
    private JButton btnSearch;
    private JTextField textQuery;
    private JTextArea logArea;
    private JLabel resultsLabel;

    private String logs = "";
    private LuceneHelper luceneHelper;

    public Program6() {
        luceneHelper = new LuceneHelper();
        btnSearch.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                try {
                    // lucene
                    logs = luceneHelper.queryForExample(textQuery.getText());
                } catch (IOException e1) {
                    e1.printStackTrace();
                }
                updateLog();
            }
        });
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("Program");
        frame.setContentPane(new Program6().panel1);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.pack();
        frame.setSize(800, 600);
        frame.setVisible(true);
    }

    private void updateLog() {
        logArea.setText(logs);
    }

}
