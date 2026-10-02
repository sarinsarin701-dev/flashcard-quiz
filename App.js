import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  SafeAreaView
} from 'react-native';

const initialCards = [
  { id: '1', question: 'What is an Operational Amplifier (Op-Amp)?', answer: 'A high-gain voltage amplifier with differential inputs and single-ended output.' },
  { id: '2', question: 'What is the Nyquist Sampling Theorem?', answer: 'Sampling rate must be at least twice the highest frequency present in the signal (fs >= 2*fm).' },
  { id: '3', question: 'What is Gray Code and its advantage?', answer: 'A unit-distance binary code where successive values differ by only 1 bit, reducing switching errors.' }
];

export default function App() {
  const [cards, setCards] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [inputQuestion, setInputQuestion] = useState('');
  const [inputAnswer, setInputAnswer] = useState('');

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const openAddModal = () => {
    setEditingCardId(null);
    setInputQuestion('');
    setInputAnswer('');
    setModalVisible(true);
  };

  const openEditModal = () => {
    if (!currentCard) return;
    setEditingCardId(currentCard.id);
    setInputQuestion(currentCard.question);
    setInputAnswer(currentCard.answer);
    setModalVisible(true);
  };

  const handleSaveCard = () => {
    if (!inputQuestion.trim() || !inputAnswer.trim()) {
      alert('Please fill both question and answer!');
      return;
    }

    if (editingCardId) {
      setCards(cards.map(c => c.id === editingCardId ? { ...c, question: inputQuestion, answer: inputAnswer } : c));
    } else {
      const newCard = {
        id: Date.now().toString(),
        question: inputQuestion,
        answer: inputAnswer
      };
      setCards([...cards, newCard]);
      setCurrentIndex(cards.length);
    }
    setShowAnswer(false);
    setModalVisible(false);
  };

  const handleDeleteCard = () => {
    if (cards.length <= 1) {
      alert('You must have at least one card in the deck!');
      return;
    }
    const updatedCards = cards.filter((_, idx) => idx !== currentIndex);
    setCards(updatedCards);
    setCurrentIndex((prev) => (prev >= updatedCards.length ? 0 : prev));
    setShowAnswer(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>StudyForge 3D</Text>
        <Text style={styles.counterText}>Card {cards.length > 0 ? currentIndex + 1 : 0} of {cards.length}</Text>
      </View>

      <View style={styles.cardWrapper}>
        {cards.length > 0 ? (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.card3D, showAnswer ? styles.cardAnswerTheme : styles.cardQuestionTheme]}
            onPress={() => setShowAnswer(!showAnswer)}
          >
            <View style={styles.badgeContainer}>
              <Text style={[styles.badgeText, showAnswer ? styles.badgeAnswer : styles.badgeQuestion]}>
                {showAnswer ? '● ANSWER' : '● QUESTION'}
              </Text>
            </View>

            <ScrollView contentContainerStyle={styles.cardContent}>
              <Text style={styles.cardMainText}>
                {showAnswer ? currentCard.answer : currentCard.question}
              </Text>
            </ScrollView>

            <Text style={styles.tapInstruction}>Tap anywhere or use button below to flip</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.card3D}>
            <Text style={styles.cardMainText}>No cards available. Add one!</Text>
          </View>
        )}
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionBtnSecondary} onPress={openEditModal}>
          <Text style={styles.actionBtnTextSec}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.flipBtn, showAnswer ? styles.flipBtnActive : null]} 
          onPress={() => setShowAnswer(!showAnswer)}
        >
          <Text style={styles.flipBtnText}>{showAnswer ? 'Hide Answer' : 'Show Answer'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtnDanger} onPress={handleDeleteCard}>
          <Text style={styles.actionBtnTextDanger}>Delete</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navBtn} onPress={handlePrev} disabled={cards.length <= 1}>
          <Text style={styles.navBtnText}>◀ Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navBtn} onPress={handleNext} disabled={cards.length <= 1}>
          <Text style={styles.navBtnText}>Next ▶</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.fabBtn} onPress={openAddModal}>
        <Text style={styles.fabBtnText}>+ Add New Card</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalHeading}>{editingCardId ? 'Edit Flashcard' : 'Create New Flashcard'}</Text>

            <Text style={styles.inputLabel}>Question</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter question here..."
              placeholderTextColor="#94a3b8"
              value={inputQuestion}
              onChangeText={setInputQuestion}
              multiline
            />

            <Text style={styles.inputLabel}>Answer</Text>
            <TextInput
              style={[styles.textInput, { height: 90 }]}
              placeholder="Enter answer here..."
              placeholderTextColor="#94a3b8"
              value={inputAnswer}
              onChangeText={setInputAnswer}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveCard}>
                <Text style={styles.modalSaveText}>Save Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 28,
    paddingHorizontal: 16
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: 1
  },
  counterText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12
  },
  card3D: {
    width: '92%',
    minHeight: 250,
    maxHeight: 290,
    borderRadius: 20,
    padding: 22,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#161f30',
    borderWidth: 1.5,
    borderBottomWidth: 7,
    borderRightWidth: 3,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10
  },
  cardQuestionTheme: {
    borderColor: '#1e3a5f',
    backgroundColor: '#111c2e'
  },
  cardAnswerTheme: {
    borderColor: '#065f46',
    backgroundColor: '#062820'
  },
  badgeContainer: {
    width: '100%',
    alignItems: 'flex-start'
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    letterSpacing: 0.8
  },
  badgeQuestion: {
    backgroundColor: '#0c4a6e',
    color: '#38bdf8'
  },
  badgeAnswer: {
    backgroundColor: '#064e3b',
    color: '#34d399'
  },
  cardContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10
  },
  cardMainText: {
    fontSize: 19,
    color: '#f8fafc',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 28
  },
  tapInstruction: {
    fontSize: 11,
    color: '#64748b',
    fontStyle: 'italic'
  },
  quickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%'
  },
  flipBtn: {
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
    borderBottomWidth: 4,
    borderColor: '#0369a1'
  },
  flipBtnActive: {
    backgroundColor: '#059669',
    borderColor: '#047857'
  },
  flipBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15
  },
  actionBtnSecondary: {
    backgroundColor: '#334155',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderBottomWidth: 3,
    borderColor: '#1e293b'
  },
  actionBtnTextSec: {
    color: '#e2e8f0',
    fontWeight: '600',
    fontSize: 13
  },
  actionBtnDanger: {
    backgroundColor: '#7f1d1d',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderBottomWidth: 3,
    borderColor: '#450a0a'
  },
  actionBtnTextDanger: {
    color: '#fca5a5',
    fontWeight: '600',
    fontSize: 13
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '92%',
    marginTop: 8
  },
  navBtn: {
    flex: 0.48,
    backgroundColor: '#1e293b',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    borderBottomWidth: 4
  },
  navBtnText: {
    color: '#cbd5e1',
    fontWeight: 'bold',
    fontSize: 14
  },
  fabBtn: {
    width: '92%',
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderColor: '#1d4ed8'
  },
  fabBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBox: {
    width: '88%',
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: '#334155'
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38bdf8',
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 6,
    fontWeight: '600'
  },
  textInput: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    color: '#ffffff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#475569',
    marginBottom: 14,
    textAlignVertical: 'top'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  modalCancelText: {
    color: '#94a3b8',
    fontWeight: '600'
  },
  modalSaveBtn: {
    backgroundColor: '#0284c7',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8
  },
  modalSaveText: {
    color: '#ffffff',
    fontWeight: 'bold'
  }
});
