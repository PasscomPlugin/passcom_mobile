'use client';

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ScheduleCanvas from '../../../components/schedule/ScheduleCanvas';
import { createEmptySchedule, type WeeklyAvailability } from '../../../types/availability';

export default function ScheduleTestPage() {
  const [availability, setAvailability] = useState<WeeklyAvailability>(
    createEmptySchedule()
  );

  const handleSave = () => {
    console.log('Schedule saved!', availability);
    // TODO: Send to backend
  };

  return (
    <View style={styles.container}>
      <ScheduleCanvas
        availability={availability}
        onChange={setAvailability}
        onSave={handleSave}
        companyName="PassCom Mobile"
        location="Main Location"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
