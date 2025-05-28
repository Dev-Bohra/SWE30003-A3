// SupportTicket.java
package Store;

/** captures customer service requests */
public class SupportTicket implements Notify {
    private final String customerId;
    private final String issue;

    public SupportTicket(String customerId, String issue) {
        this.customerId = customerId;
        this.issue      = issue;
    }

    public void submit() {
    }
    public String getCustomerId() { return customerId; }
    public String getIssue()      { return issue;      }

    @Override
    public void send(Object payload, Object receiver) {
        /*logic to send ticker*/
    }
}
