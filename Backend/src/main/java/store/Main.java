package store;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        Database.getInstance("data/Database.json");
        Inventory.getInstance("data/Database.json");
        SpringApplication.run(Main.class, args);
    }
}