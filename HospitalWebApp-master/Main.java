package amogh;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class Main {

    public static void main(String[] args) throws InterruptedException, IOException, CsvValidationException {
	// write your code here
//
        BufferedReader bufferedReader=new BufferedReader(new FileReader("D:\\javaProjects\\Selenium\\src\\drinfo.csv"));
        String readLine=bufferedReader.readLine();
        System.out.println(readLine);
        String[] drinfo=readLine.split(",");
        String drname1=drinfo[0];
        String qua=drinfo[1];
        System.setProperty("webdriver.chrome.driver","C:\\selenium\\chromedriver_win32\\chromedriver.exe");
        WebDriver driver=new ChromeDriver();
        driver.get("http://localhost/doctor_form.html");
        Thread.sleep(2000);
        driver.findElement(By.id("drname")).sendKeys(drname1);
        Thread.sleep(1000);
        driver.findElement(By.id("drqu")).sendKeys(qua);
        Thread.sleep(2000);
        try{
     driver.findElement(By.name("dr_sun")).click();
 }catch (Exception e){
     System.out.println("couldn't find submit button ");

 }finally {
     driver.close();
 }

//JDBC CONNECTION
        Connection conn=null;
        try{
//            Class.forName("com.mysql.jdbc.Driver");
            conn= DriverManager.getConnection("jdbc:mysql://ugpgztx7leeszzit:JyYlZ2HheQD5e8zt82Ho@by59qgkgtip5p358uwli-mysql.services.clever-cloud.com:3306/by59qgkgtip5p358uwli","ugpgztx7leeszzit","JyYlZ2HheQD5e8zt82Ho");
            String q="select * from doctor order by  dr_id desc limit 1";
            Statement statement=conn.createStatement();
            ResultSet r=statement.executeQuery(q);
            r.next();
            String dr_name_fetched_from_db=r.getString("dr_name");
            String dr_qua_fetched_from_db=r.getString("qua");
//            System.out.println(r.getString("dr_name"));
//            System.out.println(r.getString("qua"));
            if(dr_name_fetched_from_db.equals(drname1)&&dr_qua_fetched_from_db.equals(qua)){
                System.out.println("test successful");
            }else {
                System.out.println("test failed");
            }
        }catch (Exception e){
            System.out.println(e);
        }finally {
            if(conn!=null){
                conn=null;
            }
        }
    }
}
