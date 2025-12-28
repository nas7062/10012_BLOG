
##  적용된 최적화 사항

### 1. 이미지 최적화
- `sizes` 속성 최적화로 적절한 이미지 크기 로드
- `quality={85}` 설정으로 이미지 품질과 파일 크기 균형
- `placeholder="blur"` 및 `blurDataURL` 추가로 레이아웃 시프트 감소
- `object-cover` 클래스 추가로 이미지 표시 최적화
- `loading="lazy"` 설정

### 2. Next.js 설정 최적화

####  `next.config.ts` 개선

- **deprecated `domains` 제거**: `remotePatterns`로 통합
- **이미지 최적화 옵션**:
  - `deviceSizes`: 다양한 디바이스 크기 지원
  - `imageSizes`: 적절한 이미지 크기 정의
  - `minimumCacheTTL: 60`: 캐시 TTL 설정
- **성능 옵션**:
  - `compress: true`: Gzip 압축 활성화
  - `poweredByHeader: false`: 보안 개선
  - `reactStrictMode: true`: React 엄격 모드
  - `swcMinify: true`: SWC로 빠른 빌드
  - `experimental.optimizeCss: true`: CSS 최적화

### 3. 폰트 최적화

####  Font Loading 전략

- `display: "swap"`: 폰트 로딩 중 텍스트 표시 (FOUT)
- `adjustFontFallback: true`: 폰트 로딩 실패 시 폴백 최적화
- `variable` 추가: CSS 변수로 폰트 관리
- 적절한 `fallback` 폰트 설정

### 4. 메타데이터 및 SEO 최적화

####  Layout 메타데이터

- `viewport` 설정 최적화
- `metadataBase` 추가로 절대 URL 설정
- OpenGraph 메타데이터 추가

### 5. 컴포넌트 최적화

####  Post 컴포넌트
- `React.memo` 적용으로 불필요한 리렌더링 방지
- `useCallback`으로 함수 메모이제이션
- 이벤트 핸들러 최적화

####  동적 임포트 (Code Splitting)
- **View 컴포넌트**: MDEditor를 동적 임포트로 지연 로딩
- `ssr: false`로 클라이언트 사이드만 로드
- 로딩 스켈레톤 추가

## 📊 예상 성능 개선 효과

### Lighthouse 점수 개선

- **Performance**: +10~20점 예상
- **LCP (Largest Contentful Paint)**: 이미지 최적화로 개선
- **CLS (Cumulative Layout Shift)**: placeholder blur로 개선
- **FCP (First Contentful Paint)**: 폰트 최적화로 개선

### 번들 크기

- 동적 임포트로 초기 번들 크기 감소
- 이미지 최적화로 전송 데이터 감소

### 로딩 속도

- 이미지 lazy loading으로 초기 로딩 시간 단축
- 폰트 display swap으로 텍스트 즉시 표시

## 🔍 추가로 고려할 최적화 사항

### 1. 서버 컴포넌트 활용

- 가능한 많은 컴포넌트를 Server Component로 전환
- 클라이언트 컴포넌트 최소화

### 2. API 최적화

- React Query의 `staleTime` 증가
- 데이터 prefetching 고려

### 3. 리소스 힌트

- `preconnect` 또는 `dns-prefetch` 추가
- 중요 리소스 `preload` 고려

### 4. 캐싱 전략

- 이미지 CDN 활용
- API 응답 캐싱 강화

### 5. 번들 분석

- `@next/bundle-analyzer`로 번들 크기 분석
- 큰 라이브러리의 동적 임포트 추가 고려
