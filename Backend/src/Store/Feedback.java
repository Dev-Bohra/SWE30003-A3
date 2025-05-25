package Store;

import java.util.List;
import java.util.Set;
import java.net.URI;
import java.nio.file.Paths;

public class Feedback {
    private static final Set<String> SUPPORTED_FILE_TYPE =
            Set.of(".jpg", ".jpeg", ".png", ".mp4");

    private double rating;
    private String description;
    private List<String> media;

    public Feedback(double rating, String description, List<String> media) {
        setRating(rating);
        setDescription(description);
        setMedia(media);
    }

    public double getRating() { return rating; }
    public void setRating(double rating) {
        if (rating < 0 || rating > 5) {
            throw new IllegalArgumentException("rating must be between 0 and 5.");
        }
        this.rating = rating;
    }

    public String getDescription() { return description; }
    public void setDescription(String description) {
        if (description == null) {
            throw new IllegalArgumentException("Description must be a string.");
        }
        this.description = description.trim();
    }

    public List<String> getMedia() { return media; }
    public void setMedia(List<String> media) {
        this.media = validateMedia(media);
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
}
