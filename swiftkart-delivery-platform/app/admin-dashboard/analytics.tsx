import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { useThemeStore } from '@/store/theme-store';
import { Card } from '@/components/ui/Card';
import { 
  BarChart2, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Store, 
  Truck,
  Calendar,
  ChevronDown
} from 'lucide-react-native';

// Mock data for analytics
const mockRevenueData = {
  daily: [1200, 980, 1400, 1100, 1600, 1300, 1500],
  weekly: [5800, 6200, 5500, 7000, 6800, 7200, 6500, 7500],
  monthly: [18000, 22000, 19500, 24000, 21000, 23500, 25000, 22500, 26000, 24500, 27000, 29000],
};

const mockOrdersData = {
  daily: [32, 28, 35, 30, 40, 38, 42],
  weekly: [180, 210, 195, 220, 205, 230, 215, 240],
  monthly: [720, 780, 750, 800, 770, 820, 790, 830, 810, 850, 830, 870],
};

const mockUsersData = {
  daily: [8, 5, 10, 7, 12, 9, 11],
  weekly: [45, 50, 48, 55, 52, 58, 54, 60],
  monthly: [180, 195, 188, 210, 200, 220, 215, 230, 225, 240, 235, 250],
};

export default function AnalyticsScreen() {
  const { colors } = useThemeStore();
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  const screenWidth = Dimensions.get('window').width;
  
  // Calculate total stats
  const totalRevenue = mockRevenueData[timeRange].reduce((sum, value) => sum + value, 0);
  const totalOrders = mockOrdersData[timeRange].reduce((sum, value) => sum + value, 0);
  const totalUsers = mockUsersData[timeRange].reduce((sum, value) => sum + value, 0);
  
  // Calculate growth percentages (mock data)
  const revenueGrowth = 12.5;
  const ordersGrowth = 8.3;
  const usersGrowth = 15.2;
  
  const renderTimeRangeSelector = () => (
    <View style={styles.timeRangeContainer}>
      <TouchableOpacity
        style={[
          styles.timeRangeOption,
          timeRange === 'daily' && { backgroundColor: colors.primary + '20' },
        ]}
        onPress={() => setTimeRange('daily')}
      >
        <Text
          style={[
            styles.timeRangeText,
            { color: timeRange === 'daily' ? colors.primary : colors.text },
          ]}
        >
          Daily
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.timeRangeOption,
          timeRange === 'weekly' && { backgroundColor: colors.primary + '20' },
        ]}
        onPress={() => setTimeRange('weekly')}
      >
        <Text
          style={[
            styles.timeRangeText,
            { color: timeRange === 'weekly' ? colors.primary : colors.text },
          ]}
        >
          Weekly
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.timeRangeOption,
          timeRange === 'monthly' && { backgroundColor: colors.primary + '20' },
        ]}
        onPress={() => setTimeRange('monthly')}
      >
        <Text
          style={[
            styles.timeRangeText,
            { color: timeRange === 'monthly' ? colors.primary : colors.text },
          ]}
        >
          Monthly
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderBarChart = (data: number[], color: string, maxValue: number) => {
    return (
      <View style={styles.chartContainer}>
        {data.map((value, index) => (
          <View key={index} style={styles.barContainer}>
            <View 
              style={[
                styles.bar, 
                { 
                  height: (value / maxValue) * 150, 
                  backgroundColor: color 
                }
              ]} 
            />
            <Text style={[styles.barLabel, { color: colors.muted }]}>
              {timeRange === 'daily' 
                ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]
                : (index + 1).toString()
              }
            </Text>
          </View>
        ))}
      </View>
    );
  };
  
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen options={{ title: 'Analytics' }} />
      
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <BarChart2 size={24} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Platform Analytics
          </Text>
        </View>
        
        {renderTimeRangeSelector()}
      </View>
      
      <View style={styles.statsContainer}>
        <Card
          style={[styles.statCard, { backgroundColor: colors.primary + '10' }]}
          elevation={0}
        >
          <View style={styles.statHeader}>
            <DollarSign size={20} color={colors.primary} />
            <View style={styles.growthBadge}>
              <TrendingUp size={12} color={colors.success} />
              <Text style={[styles.growthText, { color: colors.success }]}>
                {revenueGrowth}%
              </Text>
            </View>
          </View>
          
          <Text style={[styles.statValue, { color: colors.text }]}>
            ${totalRevenue.toLocaleString()}
          </Text>
          
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            Total Revenue
          </Text>
        </Card>
        
        <Card
          style={[styles.statCard, { backgroundColor: colors.info + '10' }]}
          elevation={0}
        >
          <View style={styles.statHeader}>
            <ShoppingBag size={20} color={colors.info} />
            <View style={styles.growthBadge}>
              <TrendingUp size={12} color={colors.success} />
              <Text style={[styles.growthText, { color: colors.success }]}>
                {ordersGrowth}%
              </Text>
            </View>
          </View>
          
          <Text style={[styles.statValue, { color: colors.text }]}>
            {totalOrders.toLocaleString()}
          </Text>
          
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            Total Orders
          </Text>
        </Card>
        
        <Card
          style={[styles.statCard, { backgroundColor: colors.success + '10' }]}
          elevation={0}
        >
          <View style={styles.statHeader}>
            <Users size={20} color={colors.success} />
            <View style={styles.growthBadge}>
              <TrendingUp size={12} color={colors.success} />
              <Text style={[styles.growthText, { color: colors.success }]}>
                {usersGrowth}%
              </Text>
            </View>
          </View>
          
          <Text style={[styles.statValue, { color: colors.text }]}>
            {totalUsers.toLocaleString()}
          </Text>
          
          <Text style={[styles.statLabel, { color: colors.muted }]}>
            New Users
          </Text>
        </Card>
      </View>
      
      <Card style={styles.chartCard} elevation={1}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Revenue
          </Text>
          <TouchableOpacity style={styles.chartOptions}>
            <Text style={[styles.chartOptionsText, { color: colors.primary }]}>
              Options
            </Text>
            <ChevronDown size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {renderBarChart(
          mockRevenueData[timeRange], 
          colors.primary, 
          Math.max(...mockRevenueData[timeRange])
        )}
      </Card>
      
      <Card style={styles.chartCard} elevation={1}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Orders
          </Text>
          <TouchableOpacity style={styles.chartOptions}>
            <Text style={[styles.chartOptionsText, { color: colors.primary }]}>
              Options
            </Text>
            <ChevronDown size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {renderBarChart(
          mockOrdersData[timeRange], 
          colors.info, 
          Math.max(...mockOrdersData[timeRange])
        )}
      </Card>
      
      <Card style={styles.chartCard} elevation={1}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            New Users
          </Text>
          <TouchableOpacity style={styles.chartOptions}>
            <Text style={[styles.chartOptionsText, { color: colors.primary }]}>
              Options
            </Text>
            <ChevronDown size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {renderBarChart(
          mockUsersData[timeRange], 
          colors.success, 
          Math.max(...mockUsersData[timeRange])
        )}
      </Card>
      
      <Card style={styles.summaryCard} elevation={1}>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>
          Platform Summary
        </Text>
        
        <View style={styles.summaryStats}>
          <View style={styles.summaryStat}>
            <View style={[styles.summaryIconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Store size={20} color={colors.primary} />
            </View>
            <Text style={[styles.summaryValue, { color: colors.text }]}>42</Text>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>Vendors</Text>
          </View>
          
          <View style={styles.summaryStat}>
            <View style={[styles.summaryIconContainer, { backgroundColor: colors.warning + '20' }]}>
              <Truck size={20} color={colors.warning} />
            </View>
            <Text style={[styles.summaryValue, { color: colors.text }]}>28</Text>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>Riders</Text>
          </View>
          
          <View style={styles.summaryStat}>
            <View style={[styles.summaryIconContainer, { backgroundColor: colors.info + '20' }]}>
              <Users size={20} color={colors.info} />
            </View>
            <Text style={[styles.summaryValue, { color: colors.text }]}>189</Text>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>Customers</Text>
          </View>
          
          <View style={styles.summaryStat}>
            <View style={[styles.summaryIconContainer, { backgroundColor: colors.success + '20' }]}>
              <Calendar size={20} color={colors.success} />
            </View>
            <Text style={[styles.summaryValue, { color: colors.text }]}>56</Text>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>Today</Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 4,
  },
  timeRangeOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 0,
  },
  statCard: {
    width: '31%',
    padding: 12,
    marginBottom: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,255,0,0.1)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  growthText: {
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  chartCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  chartOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartOptionsText: {
    fontSize: 14,
    marginRight: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 180,
    paddingTop: 16,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 10,
  },
  summaryCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    marginBottom: 32,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
  },
});