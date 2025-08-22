import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";

export const Schedule = ({ onClose, onSave,type }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [availableDays, setAvailableDays] = useState([]);
  const [timeSlotsForDay, setTimeSlotsForDay] = useState([]);

  useEffect(() => {
    const generateDaysAndInitialSlots = () => {
      const now = new Date();
      const nextTwoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      const daysMap = {};
      const interval = 30 * 60 * 1000;

      let currentTime = new Date(now);
      currentTime.setMinutes(Math.ceil(currentTime.getMinutes() / 30) * 30);

      while (currentTime < nextTwoWeeks) {
        const day = currentTime.toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const time = currentTime.toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        if (!daysMap[day]) {
          daysMap[day] = [];
        }
        daysMap[day].push({ label: time, value: currentTime.toISOString() });

        currentTime.setTime(currentTime.getTime() + interval);
      }

      const sortedDays = Object.keys(daysMap).sort(
        (a, b) => new Date(a) - new Date(b)
      );
      setAvailableDays(sortedDays);

      if (sortedDays.length > 0) {
        setTimeSlotsForDay(daysMap[sortedDays[0]]);
        setSelectedDay(sortedDays[0]);
      }
    };

    generateDaysAndInitialSlots();
  }, []);

  useEffect(() => {
    const generateTimeSlotsForSelectedDay = () => {
      if (!selectedDay) {
        setTimeSlotsForDay([]);
        setSelectedTime("");
        return;
      }

      const now = new Date();
      const targetDayStart = new Date(selectedDay);
      targetDayStart.setHours(0, 0, 0, 0);
      const nextDay = new Date(targetDayStart);
      nextDay.setDate(nextDay.getDate() + 1);

      const slots = [];
      const interval = 30 * 60 * 1000;
      let currentTime = new Date(now);

      if (targetDayStart.toDateString() === now.toDateString()) {
        currentTime.setMinutes(Math.ceil(currentTime.getMinutes() / 30) * 30);
      } else {
        currentTime = new Date(targetDayStart);
        currentTime.setHours(0, Math.ceil(currentTime.getMinutes() / 30) * 30 % 60, 0, 0);
        if (currentTime.getHours() < 0) currentTime.setHours(0, 0, 0, 0);
      }

      while (currentTime < nextDay) {
        const formattedTime = currentTime.toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        slots.push({ label: formattedTime, value: currentTime.toISOString() });
        currentTime.setTime(currentTime.getTime() + interval);
      }

      setTimeSlotsForDay(slots);
      setSelectedTime("");
    };

    generateTimeSlotsForSelectedDay();
  }, [selectedDay]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handleTimeSelect = (value) => {
    setSelectedTime(value);
  };

  const handleScheduleClick = () => {
    if (selectedTime) {
      const time = new Date(selectedTime).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });
      onSave(time);
    } else {
      Alert.alert("Please select a time slot before scheduling.");
    }
  };

  const formatDayForDisplay = (dayString) => {
    const date = new Date(dayString);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  };

  const formatFullDate = (dayString) => {
    const date = new Date(dayString);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <Modal transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{type==="dining"?"Schedule booking":"Schedule Pickup"}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysContainer}
          >
            {availableDays.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  selectedDay === day && styles.selectedDayButton
                ]}
                onPress={() => handleDayClick(day)}
              >
                <Text style={selectedDay === day ? styles.selectedDayText : styles.dayText}>
                  {formatDayForDisplay(day)}
                </Text>
              </TouchableOpacity>
            ))}
            {availableDays.length === 0 && (
              <Text style={styles.noDaysText}>No days available for scheduling.</Text>
            )}
          </ScrollView>

          {selectedDay && (
            <View style={styles.timeSlotsContainer}>
              <Text style={styles.timeSlotsTitle}>
                {formatFullDate(selectedDay)} - Select Time
              </Text>
              <ScrollView style={styles.timeSlotsScroll}>
                {timeSlotsForDay.map((slot) => (
                  <TouchableOpacity
                    key={slot.value}
                    style={[
                      styles.timeSlotButton,
                      selectedTime === slot.value && styles.selectedTimeSlotButton
                    ]}
                    onPress={() => handleTimeSelect(slot.value)}
                  >
                    <Text style={selectedTime === slot.value ? styles.selectedTimeSlotText : styles.timeSlotText}>
                      {slot.label}
                    </Text>
                  </TouchableOpacity>
                ))}
                {timeSlotsForDay.length === 0 && (
                  <Text style={styles.noTimeSlotsText}>No time slots available for this day.</Text>
                )}
              </ScrollView>
            </View>
          )}

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => onClose(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.scheduleButton,
                !selectedTime && styles.scheduleButtonDisabled
              ]}
              onPress={handleScheduleClick}
              disabled={!selectedTime}
            >
              <Text style={styles.scheduleButtonText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "black",
  },
  daysContainer: {
    paddingBottom: 8,
    marginBottom: 16,
  },
  dayButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
    marginRight: 8,
  },
  selectedDayButton: {
    backgroundColor: "#FF002E",
  },
  dayText: {
    color: "black",
  },
  selectedDayText: {
    color: "white",
    fontWeight: "600",
  },
  noDaysText: {
    fontSize: 14,
    color: "#6b7280",
  },
  timeSlotsContainer: {
    marginTop: 8,
  },
  timeSlotsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "black",
  },
  timeSlotsScroll: {
    maxHeight: 200,
  },
  timeSlotButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 8,
  },
  selectedTimeSlotButton: {
    backgroundColor: "#FF002E",
    borderColor: "#FF002E",
  },
  timeSlotText: {
    color: "black",
  },
  selectedTimeSlotText: {
    color: "white",
  },
  noTimeSlotsText: {
    fontSize: 14,
    color: "#6b7280",
  },
  buttonsContainer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "white",
  },
  cancelButtonText: {
    color: "black",
    fontSize: 14,
  },
  scheduleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FF002E",
  },
  scheduleButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  scheduleButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
