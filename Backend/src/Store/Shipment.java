package Store;
import java.util.UUID;

public class Shipment implements Notify {

    public Shipment() {

    }

    public void createShipment(Order order) {
        String tid = UUID.randomUUID().toString();
        //notify.sendTrackingNotification(order, tid);
        order.shipmentCreated(tid);
    }

    public String queryStatus(String trackingId) {
        return "IN_TRANSIT";  // stub
    }

    public void send(Object order, Object reciever) {

        if (order instanceof Order) {
            if (reciever instanceof CustomerInfo) {
                String email = ((CustomerInfo) reciever).email();
                /*
                    logic to send shipment info
                */
            }

            System.out.println("shipping order");
        }
    }

}
