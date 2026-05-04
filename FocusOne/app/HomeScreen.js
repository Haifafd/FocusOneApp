function ProgressScreen({ navigation, appData }) {
  const goal =
    appData.goals.find((g) => g.id === appData.selectedGoalId) ||
    appData.goals[0];

  const task = goal.tasks.find((t) => !t.completed) || goal.tasks[0];

  const weeklyData = [4, 5, 5, 5, 6, 5, 5];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.headerTitle}>Progress</Text>

      <View style={styles.statsRow}>
        <StatsCard title="4" subtitle="Today Focus Sessions" />
        <StatsCard title="16" subtitle="Weekly Focus Sessions" green />
      </View>

      <Card>
        <Text style={styles.cardLabel}>Week Overview</Text>

        <View style={styles.chartRow}>
          {weeklyData.map((item, index) => (
            <View key={index} style={styles.chartItem}>
              <View style={styles.chartTrack}>
                <View
                  style={[
                    styles.chartFill,
                    {
                      height: `${(item / 8) * 100}%`,
                      backgroundColor:
                        index === 4 ? COLORS.primary : '#D6DEE8',
                    },
                  ]}
                />
              </View>

              <Text style={styles.chartDay}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Text style={styles.noteText}>
          🏆 You’re 1 session away from beating your weekly record.
        </Text>

        <PrimaryButton
          title="Open Focus Session"
          onPress={() => navigation.navigate('FocusSession', { task })}
          style={{ marginTop: 16 }}
        />
      </Card>
    </ScrollView>
  );
}
