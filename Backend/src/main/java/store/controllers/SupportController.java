package store.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import store.Customer;
import store.Database;
import store.SupportTicket;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
public class SupportController {
    private final Database db = Database.getInstance();

    @PostMapping("/{customerId}")
    public ResponseEntity<SupportTicket> createTicket(
            @PathVariable String customerId,
            @RequestBody Map<String, String> body
    ) {
        String subject = body.get("subject");
        String message = body.get("message");

        if (subject == null || message == null)
            return ResponseEntity.badRequest().build();

        Customer customer = db.getCustomerById(customerId);
        if (customer == null) return ResponseEntity.notFound().build();

        SupportTicket ticket = customer.raiseSupportTicket(subject, message);

        return ResponseEntity.ok(ticket);
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<List<SupportTicket>> getTickets(@PathVariable String customerId) {
        List<SupportTicket> tickets = db.getSupportTicketsByCustomerId(customerId);
        return ResponseEntity.ok(tickets);
    }
}
