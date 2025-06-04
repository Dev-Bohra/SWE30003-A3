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
    @GetMapping("/customers")
    public ResponseEntity<List<Map<String, String>>> getAllCustomers() {
        List<Customer> all = db.loadCustomers();

        List<Map<String, String>> result = all.stream()
                .map(c -> Map.of(
                        "id", c.getCustomerInfo().id(),
                        "firstName", c.getCustomerInfo().firstName(),
                        "lastName", c.getCustomerInfo().lastName(),
                        "email", c.getCustomerInfo().email(),
                        "role", "Customer",
                        "name", c.getCustomerInfo().firstName() + " " + c.getCustomerInfo().lastName()
                ))
                .toList();

        return ResponseEntity.ok(result);
    }
    @GetMapping("/{customerId}")
    public ResponseEntity<List<SupportTicket>> getTickets(@PathVariable String customerId) {
        List<SupportTicket> tickets = db.getSupportTicketsByCustomerId(customerId);
        return ResponseEntity.ok(tickets);
    }
    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllTickets() {
        List<Map<String, Object>> all = db.getAllSupportTickets();
        return ResponseEntity.ok(all);
    }

    @PatchMapping("/status/{ticketId}")
    public ResponseEntity<SupportTicket> updateTicketStatus(
            @PathVariable String ticketId,
            @RequestBody Map<String, String> body
    ) {
        String newStatus = body.get("status");
        if (newStatus == null || newStatus.isBlank())
            return ResponseEntity.badRequest().build();

        SupportTicket updated = db.updateSupportTicketStatus(ticketId, newStatus);
        if (updated == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateCustomer(
            @PathVariable String id,
            @RequestBody Map<String, String> updates
    ) {
        String firstName = updates.get("firstName");
        String lastName = updates.get("lastName");
        String email = updates.get("email");

        if (firstName == null || lastName == null || email == null)
            return ResponseEntity.badRequest().build();

        boolean updated = db.updateCustomerDetails(id, firstName, lastName, email);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String id) {
        boolean removed = db.deleteCustomer(id);
        return removed
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
