import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
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
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-[#f0fafaff] rounded-xl w-11/12 max-w-sm p-5 mb-10">
          <Text className="text-lg font-outfit-bold mb-4 text-textprimary">{type==="dining"?"Schedule booking":"Schedule Pickup"}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8, marginBottom: 16 }}
          >
            {availableDays.map((day) => (
              <TouchableOpacity
                key={day}
                className={`p-2.5 rounded-lg mr-2 ${
                  selectedDay === day ? 'bg-primary' : 'bg-white'
                }`}
                onPress={() => handleDayClick(day)}
              >
                <Text className={`font-outfit ${
                  selectedDay === day ? 'text-white font-semibold' : 'text-textprimary'
                }`}>
                  {formatDayForDisplay(day)}
                </Text>
              </TouchableOpacity>
            ))}
            {availableDays.length === 0 && (
              <Text className="text-sm text-smalltext font-outfit">No days available for scheduling.</Text>
            )}
          </ScrollView>

          {selectedDay && (
            <View className="mt-2">
              <Text className="text-base font-outfit-bold mb-3 text-textprimary">
                {formatFullDate(selectedDay)} - Select Time
              </Text>
              <ScrollView className="max-h-48 mb-3">
                {timeSlotsForDay.map((slot) => (
                  <TouchableOpacity
                    key={slot.value}
                    className={`p-3 rounded-lg border mb-2 ${
                      selectedTime === slot.value 
                        ? 'bg-primary border-primary' 
                        : 'bg-white border-border'
                    }`}
                    onPress={() => handleTimeSelect(slot.value)}
                  >
                    <Text className={`font-outfit ${
                      selectedTime === slot.value ? 'text-white' : 'text-textprimary'
                    }`}>
                      {slot.label}
                    </Text>
                  </TouchableOpacity>
                ))}
                {timeSlotsForDay.length === 0 && (
                  <Text className="text-sm text-smalltext font-outfit">No time slots available for this day.</Text>
                )}
              </ScrollView>
            </View>
          )}

          <View className="mt-10 flex-row justify-end gap-2">
            <TouchableOpacity
              className="px-4 py-2 rounded-lg bg-white"
              onPress={() => onClose(false)}
            >
              <Text className="text-textprimary font-outfit">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                selectedTime ? 'bg-primary' : 'bg-gray-300'
              }`}
              onPress={handleScheduleClick}
              disabled={!selectedTime}
            >
              <Text className="text-white font-outfit">Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Schedule;