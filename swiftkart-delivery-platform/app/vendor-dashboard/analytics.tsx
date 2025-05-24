import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Card } from '@/components/ui/Card';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Star, 
  Calendar, 
  ChevronDown, 
  ArrowUp, 
  ArrowDown,
  DollarSign,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

// Mock analytics data
const mockAnalytics = {
  revenue: {
    total: 4587.25,
    change: 12.5,
    data: [2100, 2400, 1800, 2600, 3200, 3800, 4587],
  },
  orders: {
    total: 156,
    change: 8.2,
    data: [65, 72, 58, 80, 95, 110, 156],
  },
  customers: {
    total: 87,
    change: 15.3,
    data: [30, 35, 42, 50, 62, 75, 87],
  },
  rating: {
    average: 4.7,
    change: 0.2,
    data: [4.3, 4.4, 4.5, 4.5, 4.6, 4.6, 4.7],
  },
  topProducts: [
    { name: 'Fresh Organic Apples', sales: 32, percentage: 20 },
    { name: 'Whole Grain Bread', sales: 28, percentage: 18 },
    { name: 'Organic Milk', sales: 24, percentage: 15 },
    { name: 'Free-Range Eggs', sales: 20, percentage: 13 },
    { name: 'Organic Spinach', sales: 18, percentage: 11 },
    { name: 'Other Products', sales: 34, percentage: 23 },
  ],
  salesByDay: [
    { day: 'Mon', sales: 580 },
    { day: 'Tue', sales: 620 },
    { day: 'Wed', sales: 750 },
    { day: 'Thu', sales: 820 },
    { day: 'Fri', sales: 950 },
    { day: 'Sat', sales: 1100 },
    { day: 'Sun', sales: 780 },
  ],
};

const timeRanges = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last Year'];

export default function AnalyticsScreen() {
  const { colors } = useThemeStore();
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width - 32; // Adjust for padding
  
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[0]);
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
  
  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: (opacity = 1) => colors.primary,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: () => colors.text,
  };
  
  const pieChartData = mockAnalytics.topProducts.map((product, index) => {
    const colorOptions = [
      colors.primary,
      colors.info,
      colors.success,
      colors.warning,
      colors.error,
      colors.muted,
    ];
    
    return {
      name: product.name,
      sales: product.sales,
      percentage: product.percentage,
      color: colorOptions[index % colorOptions.length],
      legendFontColor: colors.text,
      legendFontSize: 12,
    };
  });
  
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen options={{ title: 'Analytics' }} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Store Performance
        </Text>
        
        <View style={styles.timeRangeContainer}>
          <TouchableOpacity
            style={[styles.timeRangeButton, { backgroundColor: colors.card }]}
            onPress={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
          >
            <Text style={[styles.timeRangeText, { color: colors.text }]}>
              {selectedTimeRange}
            </Text>
            <ChevronDown size={16} color={colors.text} />
          </TouchableOpacity>
          
          {showTimeRangeDropdown && (
            <View 
              style={[
                styles.timeRangeDropdown,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              {timeRanges.map((range) => (
                <TouchableOpacity
                  key={range}
                  style={[
                    styles.timeRangeOption,
                    selectedTimeRange === range && { backgroundColor: colors.primary + '20' },
                  ]}
                  onPress={() => {
                    setSelectedTimeRange(range);
                    setShowTimeRangeDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.timeRangeOptionText,
                      { 
                        color: selectedTimeRange === range 
                          ? colors.primary 
                          : colors.text 
                      },
                    ]}
                  >
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <Card
            style={[styles.statCard, { backgroundColor: colors.card }]}
            elevation={1}
          >
            <View style={styles.statHeader}>
              <View 
                style={[
                  styles.statIconContainer, 
                  { backgroundColor: colors.primary + '20' },
                ]}
              >
                <DollarSign size={20} color={colors.primary} />
              </View>
              
              <View style={styles.statChangeContainer}>
                <Text
                  style={[
                    styles.statChangeText,
                    { color: mockAnalytics.revenue.change >= 0 ? colors.success : colors.error },
                  ]}
                >
                  {mockAnalytics.revenue.change >= 0 ? '+' : ''}
                  {mockAnalytics.revenue.change}%
                </Text>
                {mockAnalytics.revenue.change >= 0 ? (
                  <ArrowUp size={12} color={colors.success} />
                ) : (
                  <ArrowDown size={12} color={colors.error} />
                )}
              </View>
            </View>
            
            <Text style={[styles.statValue, { color: colors.text }]}>
              ${mockAnalytics.revenue.total.toFixed(2)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              Total Revenue
            </Text>
          </Card>
          
          <Card
            style={[styles.statCard, { backgroundColor: colors.card }]}
            elevation={1}
          >
            <View style={styles.statHeader}>
              <View 
                style={[
                  styles.statIconContainer, 
                  { backgroundColor: colors.info + '20' },
                ]}
              >
                <ShoppingBag size={20} color={colors.info} />
              </View>
              
              <View style={styles.statChangeContainer}>
                <Text
                  style={[
                    styles.statChangeText,
                    { color: mockAnalytics.orders.change >= 0 ? colors.success : colors.error },
                  ]}
                >
                  {mockAnalytics.orders.change >= 0 ? '+' : ''}
                  {mockAnalytics.orders.change}%
                </Text>
                {mockAnalytics.orders.change >= 0 ? (
                  <ArrowUp size={12} color={colors.success} />
                ) : (
                  <ArrowDown size={12} color={colors.error} />
                )}
              </View>
            </View>
            
            <Text style={[styles.statValue, { color: colors.text }]}>
              {mockAnalytics.orders.total}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              Total Orders
            </Text>
          </Card>
        </View>
        
        <View style={styles.statsRow}>
          <Card
            style={[styles.statCard, { backgroundColor: colors.card }]}
            elevation={1}
          >
            <View style={styles.statHeader}>
              <View 
                style={[
                  styles.statIconContainer, 
                  { backgroundColor: colors.warning + '20' },
                ]}
              >
                <Users size={20} color={colors.warning} />
              </View>
              
              <View style={styles.statChangeContainer}>
                <Text
                  style={[
                    styles.statChangeText,
                    { color: mockAnalytics.customers.change >= 0 ? colors.success : colors.error },
                  ]}
                >
                  {mockAnalytics.customers.change >= 0 ? '+' : ''}
                  {mockAnalytics.customers.change}%
                </Text>
                {mockAnalytics.customers.change >= 0 ? (
                  <ArrowUp size={12} color={colors.success} />
                ) : (
                  <ArrowDown size={12} color={colors.error} />
                )}
              </View>
            </View>
            
            <Text style={[styles.statValue, { color: colors.text }]}>
              {mockAnalytics.customers.total}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              Total Customers
            </Text>
          </Card>
          
          <Card
            style={[styles.statCard, { backgroundColor: colors.card }]}
            elevation={1}
          >
            <View style={styles.statHeader}>
              <View 
                style={[
                  styles.statIconContainer, 
                  { backgroundColor: colors.success + '20' },
                ]}
              >
                <Star size={20} color={colors.success} />
              </View>
              
              <View style={styles.statChangeContainer}>
                <Text
                  style={[
                    styles.statChangeText,
                    { color: mockAnalytics.rating.change >= 0 ? colors.success : colors.error },
                  ]}
                >
                  {mockAnalytics.rating.change >= 0 ? '+' : ''}
                  {mockAnalytics.rating.change}
                </Text>
                {mockAnalytics.rating.change >= 0 ? (
                  <ArrowUp size={12} color={colors.success} />
                ) : (
                  <ArrowDown size={12} color={colors.error} />
                )}
              </View>
            </View>
            
            <Text style={[styles.statValue, { color: colors.text }]}>
              {mockAnalytics.rating.average}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              Average Rating
            </Text>
          </Card>
        </View>
      </View>
      
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Revenue Trend
          </Text>
          <LineChartIcon size={20} color={colors.primary} />
        </View>
        
        <Card
          style={[styles.chartCard, { backgroundColor: colors.card }]}
          elevation={1}
        >
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [
                {
                  data: mockAnalytics.revenue.data,
                  color: (opacity = 1) => colors.primary,
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth - 32} // Adjust for card padding
            height={220}
            chartConfig={{
              ...chartConfig,
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: colors.primary,
              },
            }}
            bezier
            style={styles.chart}
          />
        </Card>
      </View>
      
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Sales by Day
          </Text>
          <BarChartIcon size={20} color={colors.info} />
        </View>
        
        <Card
          style={[styles.chartCard, { backgroundColor: colors.card }]}
          elevation={1}
        >
          <BarChart
            data={{
              labels: mockAnalytics.salesByDay.map(item => item.day),
              datasets: [
                {
                  data: mockAnalytics.salesByDay.map(item => item.sales),
                  color: (opacity = 1) => colors.info,
                },
              ],
            }}
            width={screenWidth - 32} // Adjust for card padding
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => colors.info,
            }}
            style={styles.chart}
            showValuesOnTopOfBars
          />
        </Card>
      </View>
      
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Top Products
          </Text>
          <PieChartIcon size={20} color={colors.success} />
        </View>
        
        <Card
          style={[styles.chartCard, { backgroundColor: colors.card }]}
          elevation={1}
        >
          <PieChart
            data={pieChartData}
            width={screenWidth - 32} // Adjust for card padding
            height={220}
            chartConfig={chartConfig}
            accessor="percentage"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </Card>
        
        <View style={styles.topProductsList}>
          {mockAnalytics.topProducts.map((product, index) => (
            <View 
              key={index}
              style={[
                styles.topProductItem,
                index < mockAnalytics.topProducts.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <View style={styles.topProductInfo}>
                <View 
                  style={[
                    styles.topProductDot,
                    { backgroundColor: pieChartData[index].color },
                  ]}
                />
                <Text style={[styles.topProductName, { color: colors.text }]}>
                  {product.name}
                </Text>
              </View>
              
              <View style={styles.topProductStats}>
                <Text style={[styles.topProductSales, { color: colors.text }]}>
                  {product.sales} sales
                </Text>
                <Text style={[styles.topProductPercentage, { color: colors.muted }]}>
                  {product.percentage}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  timeRangeContainer: {
    position: 'relative',
  },
  timeRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 8,
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeRangeDropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    width: 150,
    borderRadius: 8,
    borderWidth: 1,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeRangeOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  timeRangeOptionText: {
    fontSize: 14,
  },
  statsContainer: {
    padding: 16,
    paddingTop: 0,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statChangeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  chartSection: {
    padding: 16,
    paddingTop: 0,
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  chartCard: {
    padding: 16,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 8,
  },
  topProductsList: {
    marginTop: 16,
  },
  topProductItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  topProductInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  topProductDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  topProductName: {
    fontSize: 14,
    fontWeight: '500',
  },
  topProductStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topProductSales: {
    fontSize: 14,
    fontWeight: '500',
  },
  topProductPercentage: {
    fontSize: 14,
    width: 40,
    textAlign: 'right',
  },
});