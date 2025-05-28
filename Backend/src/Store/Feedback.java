package Store;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.net.URI;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.Set;

public class Feedback implements Notify {
    private static final Set<String> SUPPORTED_FILE_TYPE =
            Set.of(".jpg", ".jpeg", ".png", ".mp4");
    private final String orderId;
    private final String productId;
    private final int rating;
    private final String comment;
    private List<String> media;

    @JsonCreator
    public Feedback(
            @JsonProperty("orderId") String orderId,
            @JsonProperty("productId") String productId,
            @JsonProperty("rating") int rating,
            @JsonProperty("comment") String comment,
            @JsonProperty("media") List<String> media
    ) {
        this.orderId   = Objects.requireNonNull(orderId,   "orderId required");
        this.productId = Objects.requireNonNull(productId, "productId required");
        if (rating < 0 || rating > 5)
            throw new IllegalArgumentException("Rating 0–5");
        this.rating = rating;
        this.comment = Objects.requireNonNull(comment, "Comment required");
        setMedia(media);
    }

    public String getOrderId()   { return orderId;   }
    public String getProductId() { return productId; }
    public int    getRating()    { return rating;    }
    public String getComment()   { return comment;   }
    public List<String> getMedia() { return media; }

    public void setMedia(List<String> media) {
        this.media = validateMedia(media);
    }

    public void submit() {
        Database.getInstance().saveFeedback(this);
        send("admin"); //TODO fix this when admin object is made
    }

    private List<String> validateMedia(List<String> media) {
        if (media == null) {
            throw new IllegalArgumentException("Media must be a list of URLs.");
        }
        if (media.size() > 4) {
            throw new IllegalArgumentException("Only 4 media files are allowed.");
        }
        for (String link : media) {
            String ext = getExtension(link);
            if (!SUPPORTED_FILE_TYPE.contains(ext)) {
                throw new IllegalArgumentException("Unsupported file extension: " + ext);
            }
        }
        return media;
    }

    private String getExtension(String url) {
        String path = URI.create(url).getPath();
        String name = Paths.get(path).getFileName().toString();
        int idx = name.lastIndexOf('.');
        return (idx >= 0 ? name.substring(idx).toLowerCase() : "");
    }
    @Override
    public void send(Object receiver) {}
}
