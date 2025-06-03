// SupportTicket.java
package store;

import java.time.Instant;
import java.util.UUID;

/**
 * captures customer service requests
 */
public class SupportTicket implements Notify {
    private final String customerId;
    private final String ticketId;
    private final String subject;
    private final String issue;
    private final String createdAt;
    private String status;

    public SupportTicket(String customerId, String subject, String issue) {
        this.ticketId = UUID.randomUUID().toString();
        this.customerId = customerId;
        this.subject = subject;
        this.issue = issue;
        this.createdAt = Instant.now().toString();
        this.status = "OPEN";
    }

    public String getStatus() {
        return status;
    }

    public String getSubject() {
        return subject;
    }

    public String getTicketId() {
        return ticketId;
    }
    public String getCustomerId() {
        return customerId;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public String getIssue() {
        return issue;
    }

    @Override
    public void send(Object receiver) {
        /*logic to send ticket*/
    }
}
