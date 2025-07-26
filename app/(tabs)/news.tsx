import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Linking, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

import NewsCard from '@/components/NewsCard';

type Article = {
  title: string;
  urlToImage: string | null;
  description: string;
  url: string;
};

export default function NewsScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [country, setCountry] = useState('us');
  const [loading, setLoading] = useState(true);

  const categories = [
    'general', 'business', 'entertainment', 'health',
    'science', 'sports', 'technology',
  ];

  const countries = [
    { name: 'United States', code: 'us' },
    { name: 'United Kingdom', code: 'gb' },
    { name: 'Japan', code: 'jp' },
    { name: 'Vietnam', code: 'vn' },
  ];
  
  const fetchNews = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const endpoint = searchQuery.trim()
        ? 'https://newsapi.org/v2/everything'
        : 'https://newsapi.org/v2/top-headlines';

      const params = searchQuery.trim()
        ? {
            q: searchQuery,
            apiKey: '7a6b0a65534e413d946cf2416eeffe2f',
          }
        : {
            country,
            category, 
            apiKey: '7a6b0a65534e413d946cf2416eeffe2f',
          };

      const response = await axios.get(endpoint, { params });

      if (!searchQuery.trim() && response.data.articles.length === 0) {
        // fallback to everything if top-headlines returns empty
        const fallback = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: category,
            apiKey: '7a6b0a65534e413d946cf2416eeffe2f',
          },
        });
        setArticles(fallback.data.articles);
      } else {
        setArticles(response.data.articles);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchNews();
    }, 500); // wait 500ms after the last keypress

    return () => clearTimeout(delayDebounce); // cleanup if user types again before 500ms
  }, [searchQuery, category, country]);

  const openArticle = (url: string) => {
    Linking.openURL(url);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchNews();
      setLoading(false);
    })();
  }, [category, searchQuery]);

  const handleSearch = () => {
    fetchNews();
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Top Headlines</Text>

      <View style={{ flexDirection: 'row', marginVertical: 10 }}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search news..."
          style={styles.searchBar}
        />
        <TouchableOpacity onPress={handleSearch} style={{ marginLeft: 8, justifyContent: 'center' }}>
          <View style={{ backgroundColor: '#6200ea' }}>
            <Text style={{color:'white', paddingHorizontal:12, paddingVertical: 10 }}>Search</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontWeight: 'bold', color: 'white' }}>Select Country:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {countries.map((c) => (
            <TouchableOpacity
              key={c.code}
              onPress={() => setCountry(c.code)}
              style={{
                padding: 8,
                backgroundColor: country === c.code ? '#ffb404ff' : '#ffffff22',
                borderRadius: 20,
                margin: 4,
              }}
            >
              <Text style={{ color: 'white' }}>
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>


      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              {
                padding: 8,
                backgroundColor: category === cat ? '#6200ea' : '#ffffff22',
                borderRadius: 20,
                margin: 4,
              },
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text style={{ color: 'white'}}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
      ) : articles.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: 'white' }}>
          😢 No news found for this selection.
        </Text>
      ) : (
        <FlatList
          data={articles}
          renderItem={({ item }) => (
            <NewsCard
              title={item.title}
              description={item.description}
              urlToImage={item.urlToImage}
              onPress={() => openArticle(item.url)}
            />
          )}
          keyExtractor={(_item, index) => index.toString()}
          refreshing={refreshing}
          onRefresh={()=>fetchNews(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0f0f0f', 
    padding: 16 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 12,
    color: '#fff'
  },
  searchBar: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  }
});