import React, { useState, useRef, useEffect } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
  Image,
  Platform,
  FlatList
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function ExpenseAnalytics() {
  // Refs & Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const chartAnimValue = useRef(new Animated.Value(0)).current;
  
  // State
  const [period, setPeriod] = useState('weekly');
  const [activeCategory, setActiveCategory] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  
  // Animation on component mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 60000,
            easing: Easing.linear,
            useNativeDriver: true
          }),
        ])
      ),
      Animated.timing(chartAnimValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
        easing: Easing.elastic(1.3)
      })
    ]).start();
  }, []);

  // Animation values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [180, 80],
    extrapolate: 'clamp'
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp'
  });
  
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp'
  });
  
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Data
  const categoriesData = [
    { 
      id: '1',
      category: 'Bills', 
      amount: 305.85,
      amountStr: '$305.85', 
      percentage: 30.80, 
      color: '#FF6B6B',
      gradient: ['#FF6B6B', '#FF8E8E'],
      icon: 'file-invoice',
      transactions: 4,
      trend: '+5.2%',
      trendDirection: 'up'
    },
    { 
      id: '2',
      category: 'Insurance', 
      amount: 200.00,
      amountStr: '$200.00', 
      percentage: 20.14, 
      color: '#4ECDC4',
      gradient: ['#4ECDC4', '#7BE495'],
      icon: 'shield-alt',
      transactions: 1,
      trend: '-2.1%',
      trendDirection: 'down'
    },
    { 
      id: '3',
      category: 'Shopping', 
      amount: 190.00,
      amountStr: '$190.00', 
      percentage: 19.13, 
      color: '#FFD166',
      gradient: ['#FFD166', '#FFEC82'],
      icon: 'shopping-cart',
      transactions: 7,
      trend: '+12.4%',
      trendDirection: 'up'
    },
    { 
      id: '4',
      category: 'Food', 
      amount: 121.55,
      amountStr: '$121.55', 
      percentage: 12.24, 
      color: '#6A0572',
      gradient: ['#6A0572', '#AB83A1'],
      icon: 'utensils',
      transactions: 15,
      trend: '-3.7%',
      trendDirection: 'down'
    },
    { 
      id: '5',
      category: 'Broadband', 
      amount: 100.00,
      amountStr: '$100.00', 
      percentage: 10.07, 
      color: '#5E60CE',
      gradient: ['#5E60CE', '#7981FF'],
      icon: 'wifi',
      transactions: 1,
      trend: '0%',
      trendDirection: 'flat'
    },
    { 
      id: '6',
      category: 'Clothing', 
      amount: 50.55,
      amountStr: '$50.55', 
      percentage: 5.09, 
      color: '#F72585',
      gradient: ['#F72585', '#FF79AF'],
      icon: 'tshirt',
      transactions: 3,
      trend: '-15.2%',
      trendDirection: 'down'
    },
    { 
      id: '7',
      category: 'Entertainment', 
      amount: 25.00,
      amountStr: '$25.00', 
      percentage: 2.53, 
      color: '#3A0CA3',
      gradient: ['#3A0CA3', '#6C63FF'],
      icon: 'dice',
      transactions: 2,
      trend: '+20.5%',
      trendDirection: 'up'
    }
  ];

  // Total expenses
  const totalExpense = categoriesData.reduce((sum, item) => sum + item.amount, 0);
  
  // Last 6 months data
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  const expenseHistory = [850, 1050, 975, 1200, 980, 992.95];
  const incomeHistory = [3500, 4200, 3800, 4500, 4800, 8700];
  
  // Weekly data
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyExpense = [120, 85, 210, 145, 195, 140, 97.95];
  
  // Daily spending
  const dailySpending = [
    { id: '1', time: '09:23 AM', place: 'Starbucks', amount: -7.85, category: 'Food' },
    { id: '2', time: '12:45 PM', place: 'Whole Foods', amount: -32.41, category: 'Food' },
    { id: '3', time: '03:17 PM', place: 'Amazon Prime', amount: -14.99, category: 'Subscription' },
    { id: '4', time: '05:30 PM', place: 'Uber', amount: -18.50, category: 'Transportation' },
    { id: '5', time: '07:12 PM', place: 'Nike Store', amount: -120.00, category: 'Shopping' },
  ];
  
  // AI-generated insights
  const insights = [
    "You've spent 15% more on food this week compared to your average",
    "Your shopping expenses are 3x higher than similar users",
    "Based on your spending pattern, you could save $215 monthly",
    "Try our recommended budget plan to reduce expenses by 20%"
  ];
  
  // Chart configurations
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(94, 96, 206, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 12,
      fontWeight: 'bold',
    },
  };
  
  // Chart data
  const lineChartData = {
    labels: period === 'weekly' ? weekdays : months,
    datasets: [
      {
        data: period === 'weekly' ? weeklyExpense : expenseHistory,
        color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: period === 'weekly' ? weeklyExpense.map(v => v * 1.5) : incomeHistory,
        color: (opacity = 1) => `rgba(94, 96, 206, ${opacity})`,
        strokeWidth: 2,
      }
    ],
    legend: ["Expense", "Income"]
  };
  
  // Animated bar chart data for categories
  const categoryBarData = {
    labels: categoriesData.map(cat => cat.category.substring(0, 3)),
    datasets: [
      {
        data: categoriesData.map(cat => cat.amount)
      }
    ]
  };
  
  // Header Component with Parallax Effect
  const AnimatedHeader = () => (
    <Animated.View style={[styles.header, { height: headerHeight }]}>
      <LinearGradient
        colors={['#5E60CE', '#4EA8DE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Animated.View style={[styles.headerContent, { opacity: headerOpacity }]}>
          <Text style={styles.headerTitle}>Financial Pulse</Text>
          <Animated.View 
            style={[
              styles.headerCircle, 
              { transform: [{ scale: scaleAnim }, { rotate: rotation }] }
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.circleGradient}
            />
          </Animated.View>
          <View style={styles.moneyContainer}>
            <Text style={styles.moneyLabel}>Total Expenses</Text>
            <Text style={styles.moneyValue}>${totalExpense.toFixed(2)}</Text>
            <Text style={styles.moneyBalance}>
              Balance: <Text style={styles.balanceValue}>${(8700 - totalExpense).toFixed(2)}</Text>
            </Text>
          </View>
        </Animated.View>
        
        <Animated.View style={[styles.headerTitleBar, { opacity: headerTitleOpacity }]}>
          <TouchableOpacity>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerScrolledTitle}>Financial Pulse</Text>
          <TouchableOpacity>
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
  
  // Time Period Selector
  const PeriodSelector = () => (
    <View style={styles.periodSelector}>
      <TouchableOpacity 
        style={[styles.periodOption, period === 'daily' && styles.activePeriod]}
        onPress={() => setPeriod('daily')}
      >
        <Text style={[styles.periodText, period === 'daily' && styles.activePeriodText]}>Day</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.periodOption, period === 'weekly' && styles.activePeriod]}
        onPress={() => setPeriod('weekly')}
      >
        <Text style={[styles.periodText, period === 'weekly' && styles.activePeriodText]}>Week</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.periodOption, period === 'monthly' && styles.activePeriod]}
        onPress={() => setPeriod('monthly')}
      >
        <Text style={[styles.periodText, period === 'monthly' && styles.activePeriodText]}>Month</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.periodOption, period === 'yearly' && styles.activePeriod]}
        onPress={() => setPeriod('yearly')}
      >
        <Text style={[styles.periodText, period === 'yearly' && styles.activePeriodText]}>Year</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Category Card
  const CategoryCard = ({ item }) => {
    const isActive = activeCategory === item.id;
    return (
      <TouchableOpacity
        onPress={() => {
          setActiveCategory(isActive ? null : item.id);
          setShowDetailView(true);
        }}
        activeOpacity={0.9}
      >
        <Animated.View 
          style={[
            styles.categoryCard,
            isActive && styles.activeCategoryCard,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}
        >
          <LinearGradient
            colors={item.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.categoryGradient}
          >
            <View style={styles.categoryIconContainer}>
              <FontAwesome5 name={item.icon} size={24} color="white" />
            </View>
            <Text style={styles.categoryName}>{item.category}</Text>
            <Text style={styles.categoryAmount}>{item.amountStr}</Text>
            <View style={styles.categoryFooter}>
              <Text style={styles.categoryPercentage}>{item.percentage.toFixed(1)}%</Text>
              <View style={styles.trendContainer}>
                <MaterialIcons 
                  name={item.trendDirection === 'up' ? 'trending-up' : item.trendDirection === 'down' ? 'trending-down' : 'trending-flat'} 
                  size={14} 
                  color={item.trendDirection === 'up' ? '#4ECDC4' : item.trendDirection === 'down' ? '#FF6B6B' : 'white'} 
                />
                <Text style={styles.trendText}>{item.trend}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  };
  
  // Category Detail View
  const CategoryDetailView = () => {
    const selectedCategory = categoriesData.find(cat => cat.id === activeCategory);
    
    if (!selectedCategory) return null;
    
    return (
      <View style={styles.detailView}>
        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>{selectedCategory.category} Details</Text>
          <TouchableOpacity onPress={() => setShowDetailView(false)}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.detailStatsContainer}>
          <View style={styles.detailStat}>
            <Text style={styles.detailStatLabel}>Amount</Text>
            <Text style={styles.detailStatValue}>{selectedCategory.amountStr}</Text>
          </View>
          <View style={styles.detailStat}>
            <Text style={styles.detailStatLabel}>Transactions</Text>
            <Text style={styles.detailStatValue}>{selectedCategory.transactions}</Text>
          </View>
          <View style={styles.detailStat}>
            <Text style={styles.detailStatLabel}>Trend</Text>
            <View style={styles.detailTrendContainer}>
              <MaterialIcons 
                name={selectedCategory.trendDirection === 'up' ? 'trending-up' : selectedCategory.trendDirection === 'down' ? 'trending-down' : 'trending-flat'} 
                size={16} 
                color={selectedCategory.trendDirection === 'up' ? '#4ECDC4' : selectedCategory.trendDirection === 'down' ? '#FF6B6B' : '#333'} 
              />
              <Text style={
                [styles.detailTrendText, 
                  { color: selectedCategory.trendDirection === 'up' ? '#4ECDC4' : selectedCategory.trendDirection === 'down' ? '#FF6B6B' : '#333' }
                ]
              }>{selectedCategory.trend}</Text>
            </View>
          </View>
        </View>
        
        {/* Here you could add detailed charts for this category */}
        <View style={styles.detailChartContainer}>
          <Text style={styles.detailChartTitle}>Spending History</Text>
          <LineChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100
                  ]
                }
              ]
            }}
            width={width - 40}
            height={200}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => selectedCategory.color + (opacity * 255).toString(16).padStart(2, '0'),
            }}
            bezier
            style={styles.chartStyle}
          />
        </View>
        
        <View style={styles.detailActionsContainer}>
          <TouchableOpacity style={styles.detailActionButton}>
            <MaterialCommunityIcons name="chart-areaspline" size={22} color="#5E60CE" />
            <Text style={styles.detailActionText}>Analysis</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailActionButton}>
            <MaterialIcons name="alarm" size={22} color="#5E60CE" />
            <Text style={styles.detailActionText}>Set Alert</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailActionButton}>
            <MaterialIcons name="edit" size={22} color="#5E60CE" />
            <Text style={styles.detailActionText}>Edit Budget</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  // Transaction Item
  const TransactionItem = ({ item }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={styles.transactionIconContainer}>
          <MaterialIcons 
            name={
              item.category === 'Food' ? 'fastfood' : 
              item.category === 'Shopping' ? 'shopping-bag' :
              item.category === 'Transportation' ? 'directions-car' :
              item.category === 'Subscription' ? 'subscriptions' : 'attach-money'
            } 
            size={20} 
            color="white" 
          />
        </View>
        <View>
          <Text style={styles.transactionPlace}>{item.place}</Text>
          <Text style={styles.transactionTime}>{item.time} • {item.category}</Text>
        </View>
      </View>
      <Text style={styles.transactionAmount}>${Math.abs(item.amount).toFixed(2)}</Text>
    </TouchableOpacity>
  );
  
  // Insights Component
  const InsightsComponent = () => (
    <View style={styles.insightsContainer}>
      <View style={styles.insightsHeader}>
        <View style={styles.insightsTitleContainer}>
          <MaterialCommunityIcons name="lightbulb-on" size={24} color="#FFD166" />
          <Text style={styles.insightsTitle}>Smart Insights</Text>
        </View>
        <TouchableOpacity onPress={() => setShowInsights(false)}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {insights.map((insight, index) => (
        <View key={index} style={styles.insightCard}>
          <View style={styles.insightIconContainer}>
            <MaterialCommunityIcons 
              name={
                index === 0 ? "food-fork-drink" : 
                index === 1 ? "cart-outline" :
                index === 2 ? "piggy-bank" : "chart-line"
              } 
              size={24} 
              color="#5E60CE" 
            />
          </View>
          <Text style={styles.insightText}>{insight}</Text>
        </View>
      ))}
      
      <TouchableOpacity style={styles.insightActionButton}>
        <Text style={styles.insightActionText}>Get Personalized Plan</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Animated Header */}
      <AnimatedHeader />
      
      {/* Main Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Time Period Selector */}
        <PeriodSelector />
        
        {/* Overview Chart */}
        <Animated.View 
          style={[
            styles.chartCard, 
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}
        >
          <View style={styles.chartCardHeader}>
            <Text style={styles.chartCardTitle}>Income vs Expenses</Text>
            <TouchableOpacity>
              <MaterialIcons name="more-horiz" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <LineChart
            data={lineChartData}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            withInnerLines={false}
            withOuterLines={true}
            withDots={true}
            withShadow={false}
            style={styles.chartStyle}
          />
          {/* AI-powered insights and recommendations */}
          <View style={styles.aiInsightsContainer}>
            <Text style={styles.aiInsightsTitle}>AI-Powered Insights</Text>
            <Text style={styles.aiInsightsText}>
              The graph shows a steady increase in your income over the last six months, 
              while your expenses have fluctuated. Notably, your expenses peaked in November.
            </Text>
            <Text style={styles.aiRecommendationsTitle}>Recommendations</Text>
            <Text style={styles.aiRecommendationsText}>
              - Consider setting a budget to manage your expenses more effectively.
              - Review your spending categories to identify areas where you can cut costs.
              - Utilize our AI-powered budget plan to save up to 20% on your monthly expenses.
            </Text>
          </View>
        </Animated.View>
        
        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Expense Categories</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {/* Categories Horizontal Scroll */}
        <View style={styles.categoriesContainer}>
          <FlatList
            data={categoriesData}
            renderItem={({ item }) => <CategoryCard item={item} />}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
        
        {/* Bar Chart for Categories */}
        <Animated.View 
          style={[
            styles.chartCard, 
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}
        >
          <View style={styles.chartCardHeader}>
            <Text style={styles.chartCardTitle}>Top Spending Categories</Text>
            <TouchableOpacity>
              <MaterialIcons name="more-horiz" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <BarChart
            data={categoryBarData}
            width={width - 40}
            height={220}
            yAxisLabel="$"
            chartConfig={{
              ...chartConfig,
              barPercentage: 0.6,
              color: (opacity = 1) => `rgba(94, 96, 206, ${opacity})`,
            }}
            style={styles.chartStyle}
            withInnerLines={true}
          />
        </Animated.View>
        
        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Spending</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.transactionsContainer}>
          {dailySpending.map(item => (
            <TransactionItem key={item.id} item={item} />
          ))}
        </View>
        
        {/* AI Insights Button */}
        <TouchableOpacity 
          style={styles.insightsButton}
          onPress={() => setShowInsights(true)}
        >
          <LinearGradient
            colors={['#5E60CE', '#4EA8DE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.insightsGradient}
          >
            <MaterialCommunityIcons name="lightbulb-on" size={24} color="#FFD166" />
            <Text style={styles.insightsButtonText}>Get AI-Powered Insights</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        {/* Spacer for bottom navigation */}
        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <LinearGradient
          colors={['#5E60CE', '#4EA8DE']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={30} color="white" />
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Modal Views */}
      {showDetailView && activeCategory && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground}
            onPress={() => setShowDetailView(false)}
            activeOpacity={1}
          />
          <CategoryDetailView />
        </View>
      )}
      
      {showInsights && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground}
            onPress={() => setShowInsights(false)}
            activeOpacity={1}
          />
          <InsightsComponent />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  headerCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 30,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  circleGradient: {
    flex: 1,
    borderRadius: 150,
  },
  moneyContainer: {
    alignItems: 'center',
    zIndex: 10,
  },
  moneyLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  moneyValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  moneyBalance: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  balanceValue: {
    color: '#FFD166',
    fontWeight: 'bold',
  },
  headerTitleBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerScrolledTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
    marginTop: 180,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    marginVertical: 15,
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  periodOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  activePeriod: {
    backgroundColor: '#5E60CE',
  },
  periodText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activePeriodText: {
    color: 'white',
    fontWeight: 'bold',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#5E60CE',
    fontWeight: '500',
  },
  categoriesContainer: {
    marginBottom: 10,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryCard: {
    width: 150,
    height: 120,
    borderRadius: 15,
    marginHorizontal: 5,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeCategoryCard: {
    borderWidth: 2,
    borderColor: '#5E60CE',
  },
  categoryGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 2,
  },
  categoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  categoryPercentage: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 2,
  },
  transactionsContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5E60CE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionPlace: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  transactionTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  fab: {
    position: 'absolute',
    bottom: 75,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#5E60CE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 100,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSpacer: {
    height: 80,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  detailView: {
    width: width - 40,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detailStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailStat: {
    flex: 1,
    alignItems: 'center',
  },
  detailStatLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detailStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detailTrendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailTrendText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  detailChartContainer: {
    marginVertical: 15,
  },
  detailChartTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  detailActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  detailActionButton: {
    alignItems: 'center',
    padding: 10,
  },
  detailActionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  insightsButton: {
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  insightsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  insightsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  insightsContainer: {
    width: width - 40,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  insightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  insightsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(94, 96, 206, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  insightActionButton: {
    backgroundColor: '#5E60CE',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  insightActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  aiInsightsContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  aiInsightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  aiInsightsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  aiRecommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  aiRecommendationsText: {
    fontSize: 14,
    color: '#666',
  },
});