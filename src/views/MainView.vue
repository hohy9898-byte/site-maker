<template>
  <div class="home-container">
    <div class="main-content-wrapper">

      <!-- 상단 영역: 화면 기준 가로/세로 완벽한 정중앙 정렬 배치의 중심 -->
      <section class="hero-section">

        <!-- 왼쪽 콘텐츠 세로 배열 (우측으로 5% 이동 레이아웃 반영) -->
        <div class="left-content">
          <!-- 메인 타이틀 -->
          <h1 class="main-title">축제, 어디까지 가는 거예요?</h1>

          <!-- 기존보다 1.5배 굵어진 회색 윤곽선 + 곡선형 말풍선 꼬리 -->
          <div class="speech-bubble-container">
            <div class="speech-bubble glass-panel text-gray-border">
              <ChatBotSearch />
              <!-- 캐릭터 쪽 모서리가 강조된 자연스러운 말풍선 꼬리 -->
              <div class="bubble-tail text-gray-border"></div>
            </div>
          </div>

          <!-- 기존보다 1.5배 굵어진 회색 윤곽선 적용 오늘의 인기글 영역 -->
          <div class="popular-posts-box glass-panel text-gray-border">
            <div class="posts-header">
              <span class="live-badge">LIVE</span>
              <span class="posts-title">오늘의 인기글 🔥</span>
            </div>
            <div class="posts-carousel-placeholder">
              <p class="placeholder-text">💬 광안리 드론쇼 명당 실시간 공유합니다! (조원 코드 연동 영역)</p>
            </div>
          </div>

          <!-- 현재 정렬 상태에서 왼쪽으로 5% 이동된 수다 떨기 버튼 -->
          <div class="button-container">
            <button class="community-tag-btn" @click="goToPage('/board')">
              👥 시민들과 수다 떨기
            </button>
          </div>
        </div>

        <!-- 오른쪽 캐릭터 이미지 영역 -->
        <div class="right-content">
          <div class="character-wrapper">
            <img src="/char-busan.webp" alt="부산 축제 마스코트 캐릭터" class="character-img" />
          </div>
        </div>
      </section>

      <!-- 하단 영역: 폰트 1.2배 확대 및 기존보다 10% 더 상단으로 밀어올린 축제 카드 섹션 -->
      <section class="festival-section">
        <h2 class="festival-section-title">✨ 지금 주목받는 부산 축제</h2>
        <div class="festival-grid">

          <!-- 축제 카드 반복 구간 (일정 정보 태그 제거 및 데이터 연동) -->
          <div
            v-for="(festival, index) in selectedFestivals"
            :key="festival.contentid || index"
            class="festival-card glass-panel text-gray-border"
          >
            <!-- 축제 이미지 (데이터에 firstimage가 있으면 표시, 없으면 플레이스홀더) -->
            <div class="card-image-placeholder">
              <img
                v-if="festival.firstimage"
                :src="festival.firstimage"
                :alt="festival.title"
                class="festival-img"
              />
              <span v-else>🌊 {{ festival.title }}</span>
            </div>

            <div class="card-info">
              <div class="card-title-row">
                <h3>{{ festival.title }}</h3>
              </div>
              <p class="desc">{{ festival.addr1 || '부산광역시 일원' }}</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ChatBotSearch from '../components/ChatBotSearch.vue'

const router = useRouter()
const selectedFestivals = ref([])

// 실제 활용하실 JSON 데이터 형태 매핑
const festivalData = {
  "region": "부산",
  "contentType": "축제공연행사",
  "contentTypeId": 15,
  "total": 72,
  "items": [
    { "addr1": "부산광역시 해운대구 APEC로 55 (우동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/92/4077792_image2_1.jpg", "title": "2026 부산국제불교박람회", "contentid": "2644679" },
    { "addr1": "부산광역시 수영구 광안해변로 219 (광안동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/41/4065341_image2_1.jpg", "title": "2026 나이트레이스 인 부산", "contentid": "3498395" },
    { "addr1": "부산광역시 해운대구 APEC로 55 (우동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/57/4077757_image2_1.jpg", "title": "제48차 유네스코 세계유산위원회 특별공연 산화비 : HEXAGRAM 22", "contentid": "4077756" },
    { "addr1": "부산광역시 사상구 삼락동", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/06/4040606_image2_1.jpg", "title": "부산국제록페스티벌", "contentid": "140799" },
    { "addr1": "부산광역시 동구 이순신대로 164 (초량동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/70/4058670_image2_1.jpg", "title": "부산항축제", "contentid": "1007868" },
    { "addr1": "부산광역시 수영구 광안해변로 219 (광안동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/10/4066810_image2_1.JPG", "title": "광안리어방축제", "contentid": "506545" },
    { "addr1": "부산광역시 해운대구 수영강변대로 85 (우동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/37/4069137_image2_1.jpg", "title": "2026 부산나이트워크42K", "contentid": "2991394" },
    { "addr1": "부산광역시 수영구 민락동 110-19", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/73/4070173_image2_1.jpg", "title": "2026 부산바다도서관", "contentid": "3497353" },
    { "addr1": "부산광역시 중구 용두산길 37-55 (광복동2가)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/73/4067473_image2_1.jpg", "title": "2026 용골 댄스 페스타", "contentid": "2952109" },
    { "addr1": "부산광역시 해운대구 APEC로 55 (우동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/26/4055726_image2_1.jpeg", "title": "세계유산위원회 대한민국관(K-Heritage House)", "contentid": "4055637" },
    { "addr1": "부산광역시 북구 덕천동 763", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/30/4054930_image2_1.jpg", "title": "부산 밀 페스티벌", "contentid": "3303393" },
    { "addr1": "부산광역시 중구 중앙동4가", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/81/4065381_image2_1.jpg", "title": "포트빌리지 부산 2026", "contentid": "3485135" },
    { "addr1": "부산광역시 해운대구 수영강변대로 120 (우동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/90/4065290_image2_1.jpg", "title": "2026 부산푸드필름페스타", "contentid": "2719122" },
    { "addr1": "부산광역시 해운대구 수영강변대로 120 (우동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/20/4064420_image2_1.jpg", "title": "부산국제매직페스티벌", "contentid": "1032770" },
    { "addr1": "부산광역시 영도구 해양로301번길 55", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/73/4060873_image2_1.jpg", "title": "글로벌 영도커피페스티벌", "contentid": "2841074" },
    { "addr1": "부산광역시 부산진구 시민공원로 73 (범전동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/63/4063563_image2_1.jpg", "title": "부산가족축제", "contentid": "2818494" },
    { "addr1": "부산광역시 해운대구 해운대해변로 280 (중동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/55/4025555_image2_1.jpg", "title": "해운대 모래축제", "contentid": "566822" },
    { "addr1": "부산광역시 해운대구 수영강변대로 120 (우동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/84/4057984_image2_1.png", "title": "국제해양영화제 (KIOFF)", "contentid": "2661307" },
    { "addr1": "부산광역시 부산진구 시민공원로 73 (범전동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/90/4056890_image2_1.png", "title": "제6회 부산 봄꽃 전시회", "contentid": "4056794" },
    { "addr1": "부산광역시 중구 광복중앙로 13 (신창동1가)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/00/4061800_image2_1.JPG", "title": "작당페스타", "contentid": "3115722" },
    { "addr1": "부산광역시 부산진구 동성로112번길 121-1", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/31/4054831_image2_1.jpg", "title": "부산연등회", "contentid": "1553601" },
    { "addr1": "부산광역시 기장군 기장읍 기장해안로 605", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/20/4059220_image2_1.jpg", "title": "기장멸치축제", "contentid": "292977" },
    { "addr1": "부산광역시 해운대구 APEC로 30 (우동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/66/4059066_image2_1.jpg", "title": "K-핸드메이드페어 부산 2026", "contentid": "2523149" },
    { "addr1": "부산광역시 해운대구 APEC로 30 (우동)", "firstimage": "", "title": "K-일러스트레이션페어 부산 2026", "contentid": "2704473" },
    { "addr1": "부산 강서구 대저1동 1-17", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/77/4046477_image2_1.JPG", "title": "강서 낙동강30리 벚꽃축제", "contentid": "2536122" },
    { "addr1": "부산광역시 해운대구 APEC로 55 (우동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/42/4038942_image2_1.jpg", "title": "2026 대한민국 과학축제 with 부산과학축전", "contentid": "2740921" },
    { "addr1": "부산광역시 영도구 해양로301번길 55 (동삼동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/41/4054241_image2_1.png", "title": "구룡마을 벚꽃축제", "contentid": "3359409" },
    { "addr1": "부산광역시 연제구 세병로 84 (거제동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/55/4046355_image2_1.jpg", "title": "연제고분판타지축제", "contentid": "4046353" },
    { "addr1": "부산광역시 사상구 사상로223번길 40 (괘법동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/14/4041614_image2_1.jpg", "title": "사상 가로공원 벚꽃야장(野/夜) 페스티벌", "contentid": "4041281" },
    { "addr1": "부산광역시 강서구 대저1동", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/62/4041162_image2_1.jpg", "title": "제22회 부산도시농업박람회", "contentid": "1907888" },
    { "addr1": "부산광역시 동구 충장대로 206 (초량동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/79/4039679_image2_1.jpg", "title": "제14회 부산국제항만컨퍼런스", "contentid": "4033328" },
    { "addr1": "부산광역시 동래구 문화로 80 (명륜동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/43/3366443_image2_1.jpg", "title": "동래읍성역사축제", "contentid": "229048" },
    { "addr1": "부산광역시 금정구 장전온천천로 48 (장전동)", "firstimage": "https://tong.visitkorea.or.kr/cms/resource/40/4008540_image2_1.jpg", "title": "라라라 페스티벌", "contentid": "2484237" },
    { "addr1": "부산광역시 수영구 광안해변로 219 (광안동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/12/3518612_image2_1.jpeg", "title": "광안리 M(Marvelous) 드론 라이트쇼", "contentid": "2786391" },
    { "addr1": "부산광역시 해운대구 해운대해변로 280 (중동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/12/3576412_image2_1.jpg", "title": "해운대 빛축제", "contentid": "2048902" },
    { "addr1": "부산광역시 수영구 광안해변로 219 (광안동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/64/3579164_image2_1.png", "title": "카운트다운 부산", "contentid": "2702333" },
    { "addr1": "부산광역시 해운대구 수영강변대로 120 (우동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/78/3569778_image2_1.jpg", "title": "크리스마스 빌리지 부산 2025", "contentid": "3437916" },
    { "addr1": "부산광역시 수영구 광남로 96 (광안동, 광안 포디움프레스티지 1)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/58/3579258_image2_1.jpg", "title": "게임 체험 팝업 전시 'Game-Playground'", "contentid": "3422647" },
    { "addr1": "부산광역시 해운대구 APEC로 55 (우동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/25/3536625_image2_1.jpg", "title": "부산국제아동도서전", "contentid": "3345610" },
    { "addr1": "부산광역시 중구 광복로 72-1 (광복동2가)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/05/3576405_image2_1.JPG", "title": "광복로 겨울빛 트리축제", "contentid": "3576410" },
    { "addr1": "부산광역시 동래구 중앙대로 1324 (온천동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/72/3574272_image2_1.jpg", "title": "온천천 빛 축제", "contentid": "3434800" },
    { "addr1": "부산광역시 영도구 해양로301번길 45 (동삼동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/90/3561790_image2_1.jpg", "title": "영도다리축제", "contentid": "1080734" },
    { "addr1": "부산광역시 남구 유엔평화로76번길 1 (대연동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/43/3537143_image2_1.jpg", "title": "부산국제공연예술마켓", "contentid": "3006246" },
    { "addr1": "부산광역시 중구 용두산길 37-30 (광복동2가)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/63/3559563_image2_1.jpg", "title": "부산중구반려동물축제", "contentid": "3559571" },
    { "addr1": "부산광역시 서구 송도해변로 100 (암남동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/36/3547136_image2_1.jpg", "title": "부산고등어축제", "contentid": "1399532" },
    { "addr1": "부산광역시 중구 광복로 72-1 (광복동2가)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/44/3556944_image2_1.png", "title": "부산 스트릿 페스타 인 광복", "contentid": "3556962" },
    { "addr1": "부산광역시 수영구 민락로6번길 29 (민락동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/52/3555352_image2_1.png", "title": "옥토버페스타 인 광안리", "contentid": "3555363" },
    { "addr1": "부산광역시 Basin구 시민공원로 73 (범전동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/71/3553771_image2_1.jpg", "title": "2025 영호남 전통시장 박람회", "contentid": "2868776" },
    { "addr1": "부산광역시 중구 용미길9번길 6-45 (남포동1가)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/08/3550808_image2_1.jpg", "title": "유라리 건맥축제", "contentid": "3001170" },
    { "addr1": "부산광역시 부산진구 시민공원로 73 (범전동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/47/3359047_image2_1.jpg", "title": "부산종합민속예술제", "contentid": "3016659" },
    { "addr1": "부산광역시 부산진구 전포동", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/54/3549654_image2_1.png", "title": "전포커피축제", "contentid": "3018117" },
    { "addr1": "부산광역시 금정구 남산로 27 (남산동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/48/3552448_image2_1.jpg", "title": "글로컬 문화 in(人) 남산 페스티벌", "contentid": "3020552" },
    { "addr1": "부산광역시 기장군 일광읍 칠암리", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/29/3553829_image2_1.JPG", "title": "기장붕장어축제in칠암", "contentid": "2860868" },
    { "addr1": "부산광역시 해운대구 수영강변대로 140 (우동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/04/3531704_image2_1.png", "title": "부산글로벌웹툰페스티벌", "contentid": "2873292" },
    { "addr1": "부산광역시 사상구 삼락동", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/40/3539740_image2_1.png", "title": "사상강변축제", "contentid": "2032436" },
    { "addr1": "부산광역시 금정구 장전온천천로 48 (장전동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/24/3534524_image2_1.jpg", "title": "부산국제공연예술제", "contentid": "2558735" },
    { "addr1": "부산광역시 해운대구 APEC로 55 (우동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/53/3536453_image2_1.jpg", "title": "부산수제맥주마스터스챌린지", "contentid": "2856938" },
    { "addr1": "부산광역시 해운대구 APEC로 55 (우동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/68/3533968_image2_1.jpg", "title": "페스티벌 시월", "contentid": "3370514" },
    { "addr1": "부산광역시 서구 송도해변로 36 (암남동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/55/3532955_image2_1.jpg", "title": "부산 서구 의료관광축제", "contentid": "3532971" },
    { "addr1": "부산광역시 중구 충장대로 26 (중앙동4가)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/60/3532060_image2_1.JPG", "title": "중구민의 날 페스타", "contentid": "3351515" },
    { "addr1": "부산광역시 기장군 기장읍 동부산관광6로 59", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/93/3525493_image2_1.png", "title": "헬로메이커", "contentid": "2560161" },
    { "addr1": "부산광역시 금정구 장전로12번길 55 (장전동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/62/3528962_image2_1.png", "title": "2025 부산세일페스타 부대앞으로", "contentid": "3528964" },
    { "addr1": "부산광역시 사하구 몰운대1길 14 (다대동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/23/3524123_image2_1.jpg", "title": "2025 서부산 슈퍼어싱 페스티벌", "contentid": "3524130" },
    { "addr1": "부산광역시 북구 생태공원길 270 (화명동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/89/3524089_image2_1.png", "title": "2025 별바다부산 나이트마켓", "contentid": "3356047" },
    { "addr1": "부산광역시 영도구 해양로301번길 55 (동삼동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/09/3495409_image2_1.png", "title": "제2회 선원의날 한마음 걷기축제", "contentid": "3495410" },
    { "addr1": "부산광역시 기장군 장안읍 임랑리", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/82/3516182_image2_1.png", "title": "기장임랑썸머뮤직페스티벌", "contentid": "2614130" },
    { "addr1": "부산광역시 해운대구 수영강변대로 120 (우동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/10/3515310_image2_1.jpg", "title": "부산국제AI영화제", "contentid": "3515311" },
    { "addr1": "부산광역시 사하구 다대동", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/21/2553821_image2_1.jpg", "title": "대한민국 국제해양레저위크(KIMA WEEK)", "contentid": "2019366" },
    { "addr1": "부산광역시 해운대구 APEC로 55 (우동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/37/3510437_image2_1.jpg", "title": "부산인디커넥트페스티벌", "contentid": "2736033" },
    { "addr1": "부산광역시 사하구 다대포 해수욕장", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/58/3504958_image2_1.jpg", "title": "부산바다축제", "contentid": "142080" },
    { "addr1": "부산광역시 해운대구 수영강변대로 120 (우동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/85/3502985_image2_1.png", "title": "2025 부산여행영화제", "contentid": "2830695" },
    { "addr1": "부산광역시 사하구 다대로 지하692 (다대동)", "firstimage": "http://tong.visitkorea.or.kr/cms/resource/05/3502005_image2_1.jpg", "title": "다대포 선셋 영화 축제", "contentid": "3383748" }
  ]
}

// 컴포넌트 마운트 시 전체 배열에서 무작위로 2개 추출하는 로직 적용
onMounted(() => {
  const items = festivalData.items
  if (items && items.length >= 2) {
    // 원본 데이터를 해치지 않기 위해 얕은 복사 후 셔플 진행
    const shuffled = [...items].sort(() => 0.5 - Math.random())
    selectedFestivals.value = shuffled.slice(0, 2)
  } else {
    selectedFestivals.value = items || []
  }
})

const goToPage = (path) => {
  router.push(path)
}
</script>

<style scoped>
/* 전체 레이아웃 (스크롤 절대 방지 고정) */
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  padding: 10px 40px;
  font-family: 'Pretendard', sans-serif;
  position: relative;
  overflow: hidden;
}

.home-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.45;
  z-index: -1;
}

/* ✨ 공통 글래스모피즘 템플릿 */
.glass-panel {
  background: rgba(255, 255, 255, 0.55) !important;
  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;
  box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.02) !important;
}

/* 윤곽선 두께 기존 1.5px에서 정확히 1.5배 올린 2.25px 커스텀 고정 */
.text-gray-border {
  border: 2.25px solid #dee2e6 !important;
}

/* 메인 구조 콘텐트 래퍼 */
.main-content-wrapper {
  max-width: 1200px;
  width: 100%;
  height: 98%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

/* 상단 요소 전체 정중앙 배치 */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
  width: 100%;
  flex-grow: 1;
}

@media (max-width: 1024px) {
  .hero-section {
    flex-direction: column-reverse;
    text-align: center;
    gap: 25px;
  }
}

/* 좌측 텍스트/말풍선 영역 (우측으로 5% 배율 인덴트 고정) */
.left-content {
  flex: 1.5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 5%;
}

@media (max-width: 1024px) {
  .left-content {
    padding-left: 0;
  }
}

/* 타이틀 스타일 */
.main-title {
  font-size: 30pt;
  font-weight: 900;
  color: #1a73e8;
  margin-top: 0px;
  margin-bottom: 30px;
  letter-spacing: -0.5px;
  text-align: center;
  line-height: 1.2;
}

/* 말풍선 컨테이너 */
.speech-bubble-container {
  width: 100%;
  margin-bottom: 24px;
}

.speech-bubble {
  position: relative;
  border-radius: 24px;
  padding: 14px 24px;
  width: 100%;
  box-sizing: border-box;
}

/* 윤곽선 두께가 2.25px로 두꺼워진 말풍선 꼬리 디자인 */
.bubble-tail {
  position: absolute;
  top: 50%;
  right: -11.2px;
  transform: translateY(-50%) rotate(45deg);
  width: 19.2px;
  height: 19.2px;
  background: rgba(255, 255, 255, 0.55);
  border-top: 2.25px solid #dee2e6 !important;
  border-right: 2.25px solid #dee2e6 !important;
  border-bottom: transparent !important;
  border-left: transparent !important;
  border-radius: 3.5px;
  z-index: 2;
}

@media (max-width: 1024px) {
  .bubble-tail {
    top: -11.2px;
    right: 50%;
    transform: translateX(50%) rotate(-45deg);
    border-top: 2.25px solid #dee2e6 !important;
    border-left: 2.25px solid #dee2e6 !important;
    border-right: transparent !important;
    border-bottom: transparent !important;
  }
}

/* 오늘의 인기글 박스 */
.popular-posts-box {
  border-radius: 20px;
  padding: 16px 25px;
  margin-bottom: 24px;
  text-align: left;
}

.posts-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.live-badge {
  background: #ea4335;
  color: white;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 5px;
}

.posts-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #334155;
}

.posts-carousel-placeholder {
  min-height: 70px;
  display: flex;
  align-items: center;
}

.placeholder-text {
  margin: 0;
  font-size: 1rem;
  color: #475569;
  font-weight: 600;
}

/* 부모 플렉스 상자 내부에서 왼쪽으로 5% 마진을 당겨 좌측 이동 보정 */
.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-left: -5%;
}

@media (max-width: 1024px) {
  .button-container {
    margin-left: 0;
  }
}

/* #dee2e6 색상 솔리드 버튼 스타일 */
.community-tag-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #dee2e6;
  border: 2.25px solid #dee2e6;
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 800;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s ease;
}

.community-tag-btn:hover {
  color: #1a73e8;
  background: #cbd5e1;
  border-color: #cbd5e1;
}

/* 오른쪽 마스코트 캐릭터 영역 */
.right-content {
  flex: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
}

.character-img {
  width: 480px;
  height: auto;
  object-fit: contain;
}

/* 하단 축제 카드 영역: 기존 위치(-240px)보다 10% 추가 상단화 적용 (-265px) */
.festival-section {
  width: 100%;
  margin-top: -265px;
  padding-bottom: 5px;
}

/* 타이틀 폰트 크기 기존 1.25rem에서 1.2배 늘어난 1.5rem으로 고도화 */
.festival-section-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: #1e293b;
  margin-bottom: 12px;
  text-align: left;
}

.festival-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.festival-card {
  border-radius: 24px;
  padding: 12px;
  transition: transform 0.2s;
}

.festival-card:hover {
  transform: translateY(-2px);
}

/* 280px 고유 카드 비율 및 동적 이미지 삽입 스케일 조정 */
.card-image-placeholder {
  width: 100%;
  height: 280px;
  background: rgba(226, 232, 240, 0.7);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 10px;
  overflow: hidden; /* 이미지가 카드 모서리를 깎아내지 않도록 방지 */
}

.festival-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지가 영역을 가득 채우도록 스타일링 */
}

.card-info {
  text-align: left;
  padding: 2px 4px;
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.card-title-row h3 {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.card-info .desc {
  font-size: 0.82rem;
  color: #475569;
  margin: 0;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* 주소가 너무 길어질 경우 말줄임표 처리 */
}
</style>
