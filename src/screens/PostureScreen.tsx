import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../components/Button';
import CircularProgress from '../components/CircularProgress';
import Icon from '../components/Icon';
import SegmentedControl from '../components/SegmentedControl';
import { CORRECT_COUNT, EXERCISES, POSTURE_SCORE, POSTURE_VERDICT } from '../lib/postureMock';
import { RootTabParamList } from '../navigation/RootNavigator';
import PostureCheckpoints from './posture/PostureCheckpoints';
import PostureSegments from './posture/PostureSegments';
import { useFitnessStore } from '../store/useFitnessStore';
import { colors, radius, withAlpha } from '../theme/colors';

type PostureStatus = 'intro' | 'recording' | 'analyzing' | 'result';

const POSTURE_VARIANT_ITEMS = [
  { label: '구간 코멘트', value: 'a' },
  { label: '항목별 점수', value: 'b' },
];

const ANALYZE_DELAY_MS = 2600;
const MAX_RECORD_SECONDS = 15;

export default function PostureScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const postureVariant = useFitnessStore((s) => s.postureVariant);
  const setPostureVariant = useFitnessStore((s) => s.setPostureVariant);

  const [exercise, setExercise] = useState(EXERCISES[0]);
  const [status, setStatus] = useState<PostureStatus>('intro');
  const [recSecs, setRecSecs] = useState(0);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const hasPermission = !!cameraPermission?.granted && !!micPermission?.granted;

  const cameraRef = useRef<CameraView>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const analyzeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
    };
  }, []);

  const ensurePermissions = async () => {
    let cam = cameraPermission;
    if (!cam?.granted) cam = await requestCameraPermission();
    let mic = micPermission;
    if (!mic?.granted) mic = await requestMicPermission();
    return !!cam?.granted && !!mic?.granted;
  };

  const startRec = async () => {
    const granted = await ensurePermissions();
    if (!granted) return;

    setRecSecs(0);
    setStatus('recording');
    intervalRef.current = setInterval(() => setRecSecs((s) => s + 1), 1000);

    try {
      await cameraRef.current?.recordAsync({ maxDuration: MAX_RECORD_SECONDS });
    } catch {
      // recording ended (stopped, max duration reached, or camera unmounted)
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus('analyzing');
    analyzeTimerRef.current = setTimeout(() => setStatus('result'), ANALYZE_DELAY_MS);
  };

  const stopRec = () => cameraRef.current?.stopRecording();
  const retake = () => {
    setStatus('intro');
    setRecSecs(0);
  };
  const goPlan = () => navigation.navigate('Plan');

  const recTime = `0:${String(recSecs).padStart(2, '0')}`;
  const scoreProgress = POSTURE_SCORE / 100;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>AI 자세교정</Text>
          <Text style={styles.subtitle}>카메라로 운동 자세를 촬영하면 AI가 피드백을 줘요</Text>
        </View>

        {(status === 'intro' || status === 'recording') && (
          <View style={styles.body}>
            {status === 'intro' && (
              <View>
                <Text style={styles.chipSectionLabel}>운동 선택</Text>
                <View style={styles.chipRow}>
                  {EXERCISES.map((name) => {
                    const active = exercise === name;
                    return (
                      <Pressable
                        key={name}
                        onPress={() => setExercise(name)}
                        style={[
                          styles.chip,
                          {
                            borderColor: active ? colors.primaryNormal : colors.lineNormal,
                            backgroundColor: active ? withAlpha(colors.primaryNormal, 0.08) : colors.backgroundNormal,
                          },
                        ]}
                      >
                        <Text style={[styles.chipText, { color: active ? colors.primaryNormal : colors.labelNeutral }]}>
                          {name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            <View style={styles.cameraBox}>
              {hasPermission ? (
                <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" mode="video" />
              ) : (
                <View style={styles.cameraPlaceholder}>
                  <Icon name="camera" size={40} color="rgba(255,255,255,0.6)" />
                  <Text style={styles.cameraPlaceholderText}>카메라 권한이 필요해요</Text>
                </View>
              )}

              {status === 'intro' && (
                <>
                  <View style={styles.guideFrame} pointerEvents="none" />
                  <View style={styles.guideCaption} pointerEvents="none">
                    <Icon name="persons-fill" size={46} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.guideCaptionText}>
                      전신이 프레임 안에 들어오도록{'\n'}1.5~2m 거리에서 촬영해 주세요
                    </Text>
                  </View>
                </>
              )}

              {status === 'recording' && (
                <>
                  <View style={styles.recFrame} pointerEvents="none" />
                  <View style={styles.recBadge} pointerEvents="none">
                    <View style={styles.recDot} />
                    <Text style={styles.recBadgeText}>REC {recTime}</Text>
                  </View>
                  <View style={styles.guideCaption} pointerEvents="none">
                    <Icon name="persons-fill" size={52} color="rgba(255,255,255,0.75)" />
                    <Text style={styles.guideCaptionText}>{exercise} 동작을 천천히 반복하세요</Text>
                  </View>
                </>
              )}
            </View>

            {status === 'intro' && (
              <View style={styles.infoNote}>
                <Icon name="circle-info" size={18} color={colors.labelAlternative} />
                <Text style={styles.infoNoteText}>
                  촬영 영상은 분석에만 사용되고 기기에만 저장돼요. 최대 15초, 밝은 곳에서 촬영하면 정확도가 높아집니다.
                </Text>
              </View>
            )}

            {status === 'intro' ? (
              <Button
                title={hasPermission ? `${exercise} 촬영 시작` : '카메라 권한 허용하기'}
                onPress={startRec}
              />
            ) : (
              <>
                <View style={styles.stopRow}>
                  <Pressable style={styles.stopButton} onPress={stopRec}>
                    <View style={styles.stopSquare} />
                  </Pressable>
                </View>
                <Text style={styles.stopHint}>버튼을 눌러 촬영을 완료하세요</Text>
              </>
            )}
          </View>
        )}

        {status === 'analyzing' && (
          <View style={styles.analyzing}>
            <ActivityIndicator size="large" color={colors.primaryNormal} />
            <Text style={styles.analyzingTitle}>자세를 분석하고 있어요</Text>
            <Text style={styles.analyzingCaption}>영상을 AI 서버로 전송해 관절 움직임을{'\n'}분석하는 중입니다</Text>
          </View>
        )}

        {status === 'result' && (
          <>
            <View style={styles.segmentWrap}>
              <SegmentedControl
                items={POSTURE_VARIANT_ITEMS}
                value={postureVariant}
                onChange={(v) => setPostureVariant(v as 'a' | 'b')}
              />
            </View>
            <View style={styles.body}>
              <View style={[styles.scoreCard, { backgroundColor: withAlpha(colors.primaryNormal, 0.06) }]}>
                <CircularProgress size={74} strokeWidth={7} progress={scoreProgress} color={colors.primaryNormal}>
                  <Text style={styles.scoreText}>{POSTURE_SCORE}</Text>
                </CircularProgress>
                <View style={{ flex: 1 }}>
                  <Text style={styles.scoreEyebrow}>{exercise} 자세 점수</Text>
                  <Text style={styles.scoreVerdict}>{POSTURE_VERDICT}</Text>
                  <Text style={styles.scoreCaption}>교정 포인트 {CORRECT_COUNT}곳을 확인했어요</Text>
                </View>
              </View>

              {postureVariant === 'a' ? <PostureSegments /> : <PostureCheckpoints />}

              <View style={styles.resultButtonRow}>
                <View style={{ flex: 1 }}>
                  <Button title="다시 촬영" variant="outlined" onPress={retake} />
                </View>
                <View style={{ flex: 1 }}>
                  <Button title="계획에 반영" onPress={goPlan} />
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.backgroundNormal },
  header: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 6 },
  title: { fontSize: 23, fontWeight: '700', color: colors.labelNormal },
  subtitle: { fontSize: 13, fontWeight: '500', color: colors.labelAlternative, marginTop: 2 },
  body: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 24, gap: 18 },
  chipSectionLabel: { fontSize: 13, fontWeight: '600', color: colors.labelNeutral, marginBottom: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 9, paddingHorizontal: 16, borderRadius: radius.pill, borderWidth: 1 },
  chipText: { fontSize: 14, fontWeight: '600' },
  cameraBox: {
    aspectRatio: 3 / 4,
    borderRadius: radius.cardXLarge,
    backgroundColor: '#16181c',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraPlaceholder: { alignItems: 'center', gap: 12, paddingHorizontal: 30 },
  cameraPlaceholderText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.72)', textAlign: 'center' },
  guideFrame: {
    position: 'absolute',
    top: 22,
    left: 22,
    right: 22,
    bottom: 22,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 16,
  },
  guideCaption: { position: 'absolute', alignItems: 'center', paddingHorizontal: 30 },
  guideCaptionText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 12, lineHeight: 19 },
  recFrame: {
    position: 'absolute',
    top: 22,
    left: 22,
    right: 22,
    bottom: 22,
    borderWidth: 2,
    borderColor: 'rgba(255,90,90,0.7)',
    borderRadius: 16,
  },
  recBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  recDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ff4d4d' },
  recBadgeText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.fillNormal,
  },
  infoNoteText: { flex: 1, fontSize: 12, fontWeight: '500', color: colors.labelNeutral, lineHeight: 18 },
  stopRow: { alignItems: 'center' },
  stopButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.backgroundNormal,
    borderWidth: 4,
    borderColor: colors.lineSolidStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopSquare: { width: 26, height: 26, borderRadius: 6, backgroundColor: '#ff4d4d' },
  stopHint: { textAlign: 'center', fontSize: 13, fontWeight: '500', color: colors.labelAlternative },
  analyzing: { paddingVertical: 70, paddingHorizontal: 30, alignItems: 'center' },
  analyzingTitle: { fontSize: 17, fontWeight: '700', color: colors.labelNormal, marginTop: 22 },
  analyzingCaption: { fontSize: 13, fontWeight: '500', color: colors.labelAlternative, marginTop: 6, textAlign: 'center', lineHeight: 19 },
  segmentWrap: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    padding: 18,
    paddingHorizontal: 20,
    borderRadius: radius.cardXLarge,
  },
  scoreText: { fontSize: 24, fontWeight: '800', color: colors.primaryNormal },
  scoreEyebrow: { fontSize: 12, fontWeight: '600', color: colors.labelAlternative },
  scoreVerdict: { fontSize: 18, fontWeight: '700', color: colors.labelNormal, marginTop: 2 },
  scoreCaption: { fontSize: 12, fontWeight: '500', color: colors.labelAlternative, marginTop: 3 },
  resultButtonRow: { flexDirection: 'row', gap: 10 },
});
