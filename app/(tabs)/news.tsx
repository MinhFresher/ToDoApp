import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';


type Article = {
  title: string;
  urlToImage: string | null;
  description: string;
  url: string;
};

export default function NewsScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState('general');

  const categories = [
    'general', 'business', 'entertainment', 'health',
    'science', 'sports', 'technology',
  ];
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          'https://newsapi.org/v2/top-headlines',
          {
            params: {
              country: 'us',
              category: category,
              apiKey: '7a6b0a65534e413d946cf2416eeffe2f',
            },
          }
        );
        setArticles(response.data.articles);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [category]);

  const openArticle = (url: string) => {
    Linking.openURL(url);
  };

  const renderItem = ({ item }: { item: Article }) => (
    <TouchableOpacity style={styles.card} onPress={() => openArticle(item.url)}>
      {item.urlToImage && (
        <Image source={{ uri: item.urlToImage }} style={styles.image} />
      )}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Top Headlines</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              {
                padding: 8,
                backgroundColor: category === cat ? '#6200ea' : '#fff',
                borderRadius: 20,
                margin: 4,
              },
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text style={{ color: category === cat ? 'white' : 'black' }}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#18191a', 
    padding: 16 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 12,
    color: '#fff'
  },
  card: { 
    marginBottom: 20, 
    borderBottomWidth: 1, 
    borderColor: '#ddd', 
    paddingBottom: 20 
  },
  image: { 
    width: '100%', 
    height: 180, 
    borderRadius: 8 
  },
  title: { 
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#fff', 
    marginTop: 8 
  },
  description: { 
    fontSize: 14, 
    color: '#fff', 
    marginTop: 4 
  },
});