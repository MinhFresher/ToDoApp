import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

type NewsCardProps = {
  title: string;
  description: string;
  urlToImage: string | null;
  onPress: () => void;
};

export default function NewsCard({ title, description, urlToImage, onPress }: NewsCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {urlToImage ? <Image source={{ uri: urlToImage }} style={styles.image} /> : null}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={3}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    height: 200,
    width: '100%',
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  description: {
    color: '#555',
  },
});
