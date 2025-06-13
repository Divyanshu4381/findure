import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NewsScreen = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFallbackImage = async (url) => {
    try {
      const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
      const json = await response.json();
      return json?.data?.image?.url || null;
    } catch (error) {
      console.error('Fallback image error:', error);
      return null;
    }
  };

  const enhanceNewsWithImages = async (articles) => {
    const enhancedNews = await Promise.all(
      articles.map(async (item) => {
        if (!item.image && item.url) {
          const fallback = await fetchFallbackImage(item.url);
          return { ...item, image: fallback };
        }
        return item;
      })
    );
    return enhancedNews;
  };

  const fetchNews = async () => {
    try {
      const response = await fetch(
        'http://api.mediastack.com/v1/news?access_key=99e6dca7325590f62c29dd786f734433&countries=in&languages=en&limit=20'
      );
      const json = await response.json();
      const data = json.data;
      const newsWithImages = await enhanceNewsWithImages(data);
      setNews(newsWithImages);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <Image source={require('../assets/no-image.png')} style={styles.image} />
      )}

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.source}>{item.source}</Text>

      {item.url && (
        <TouchableOpacity
          style={styles.readMoreBtn}
          onPress={() => Linking.openURL(item.url)}
        >
          <Text style={styles.readMoreText}>Read More</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Findure News</Text>
        <View style={styles.iconRow}>
          <Icon name="search-outline" size={22} />
          <Icon name="notifications-outline" size={22} style={{ marginLeft: 15 }} />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 12,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  source: {
    color: '#888',
    marginTop: 4,
    fontSize: 12,
  },
  readMoreBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#0e76a8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  readMoreText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default NewsScreen;
