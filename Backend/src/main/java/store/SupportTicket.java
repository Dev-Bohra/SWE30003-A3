// SupportTicket.java
package store;

/**
 * captures customer service requests
 */
public class SupportTicket implements Notify {
    private final String customerId;
    private final String issue;

    public SupportTicket(String customerId, String issue) {
        this.customerId = customerId;
        this.issue = issue;
    }

    public String getCustomerId() {
        return customerId;
    }

    public String getIssue() {
        return issue;
    }

    @Override
    public void send(Object receiver) {
        /*logic to send ticker*/
    }
}
