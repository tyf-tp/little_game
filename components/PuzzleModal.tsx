import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useGameStore } from '../store/gameStore';

interface PuzzleModalProps {
  visible: boolean;
  puzzleType: 'code' | 'sequence' | 'slider' | null;
  puzzleData: any;
  puzzleId: string;
  onClose: () => void;
  onSolve: () => void;
}

export default function PuzzleModal({
  visible,
  puzzleType,
  puzzleData,
  puzzleId,
  onClose,
  onSolve,
}: PuzzleModalProps) {
  const [input, setInput] = useState('');
  const [sequence, setSequence] = useState<string[]>([]);
  const { solvePuzzle, showMessage } = useGameStore();

  const handleSubmit = () => {
    if (puzzleType === 'code') {
      if (input === puzzleData.answer) {
        solvePuzzle(puzzleId);
        onSolve();
        Alert.alert('恭喜！', '你解开了谜题！');
        onClose();
      } else {
        Alert.alert('错误', '密码不对，再试试吧。');
        setInput('');
      }
    }
  };

  const handleSequencePress = (item: string) => {
    const newSequence = [...sequence, item];
    setSequence(newSequence);

    // 检查是否完成
    const answer = puzzleData.answer;
    if (newSequence.length === answer.length) {
      const isCorrect = newSequence.every((s, i) => s === answer[i]);
      if (isCorrect) {
        solvePuzzle(puzzleId);
        onSolve();
        Alert.alert('恭喜！', '你解开了谜题！');
        onClose();
      } else {
        Alert.alert('错误', '顺序不对，重新开始吧。');
        setSequence([]);
      }
    }
  };

  const resetSequence = () => {
    setSequence([]);
  };

  if (puzzleType === 'code') {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>密码输入</Text>
            <Text style={styles.hint}>
              {puzzleData.hint || '请输入正确的密码'}
            </Text>
            
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="输入密码"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitText}>确认</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  if (puzzleType === 'sequence') {
    const options = ['lever_1', 'lever_2'];
    const labels: Record<string, string> = {
      lever_1: 'A',
      lever_2: 'B',
      red: '🔴',
      blue: '💎',
      green: '🟢',
    };

    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>顺序谜题</Text>
            <Text style={styles.hint}>{puzzleData.hint || '按正确顺序点击'}</Text>
            
            {/* 当前顺序显示 */}
            <View style={styles.sequenceDisplay}>
              <Text style={styles.sequenceText}>
                当前: {sequence.length > 0 ? sequence.map(s => labels[s] || s).join(' → ') : '无'}
              </Text>
              <Text style={styles.sequenceCount}>
                ({sequence.length} / {puzzleData.answer.length})
              </Text>
            </View>

            {/* 操作按钮 */}
            <View style={styles.sequenceButtons}>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.sequenceBtn}
                  onPress={() => handleSequencePress(opt)}
                >
                  <Text style={styles.sequenceBtnText}>{labels[opt]}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.resetBtn} onPress={resetSequence}>
              <Text style={styles.resetText}>重置</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e94560',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  hint: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#0f0f23',
    borderRadius: 10,
    padding: 15,
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#333',
    borderRadius: 10,
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
  },
  submitBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#e94560',
    borderRadius: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sequenceDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  sequenceText: {
    color: '#fff',
    fontSize: 18,
  },
  sequenceCount: {
    color: '#666',
    fontSize: 14,
  },
  sequenceButtons: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  sequenceBtn: {
    width: 80,
    height: 80,
    backgroundColor: '#0f0f23',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  sequenceBtnText: {
    fontSize: 32,
    color: '#fff',
  },
  resetBtn: {
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  resetText: {
    color: '#4a9eff',
    fontSize: 14,
  },
});
