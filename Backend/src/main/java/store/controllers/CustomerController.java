package store.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import store.*;
import store.dtos.CustomerLoginRequest;
import store.dtos.CustomerRegistrationRequest;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    private final Authentication auth = new StubAuthService();
    private final Database db = Database.getInstance();

    @PostMapping("/register")
    public ResponseEntity<Customer> register(@RequestBody CustomerRegistrationRequest req) {
        if (db.getCustomerByEmail(req.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Customer customer = new Customer(
                req.getId(),
                req.getFirstName(),
                req.getLastName(),
                req.getEmail(),
                new Cart(),
                auth
        );

        db.addCustomer(customer);
        return ResponseEntity.ok(customer);
    }

    @PostMapping("/login")
    public ResponseEntity<CustomerInfo> login(@RequestBody CustomerLoginRequest req) {
        if (!auth.login(req.getEmail(), req.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Customer customer = db.getCustomerByEmail(req.getEmail());
        return ResponseEntity.ok(customer.getCustomerInfo());
    }
}
