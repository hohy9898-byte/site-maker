<template>
  <div id="app" class="page-layout">
    <header class="topbar">
      <div class="logo">LocalHub</div>
      <nav class="region-nav">
        <button>서울/경기</button>
        <button>대전/충청</button>
        <button>구미/경북</button>
        <button>광주/전라</button>
        <button>부울경/경남</button>
      </nav>
      <button class="icon-search">🔍</button>
    </header>

    <section class="today-popular-section">
      <div class="today-popular-head">
        <h2>오늘의 인기글</h2>
      </div>

      <div class="today-popular-viewport">
        <Transition name="fade" mode="out-in">
          <div
            v-if="currentPopularPost"
            :key="currentPopularPost.id"
            class="today-popular-item today-popular-item-clickable"
            @click="openDetail(currentPopularPost.id)"
            @keydown.enter.prevent="openDetail(currentPopularPost.id)"
            tabindex="0"
            role="button"
          >
            <span class="today-popular-title">{{ currentPopularPost.title }}</span>
          </div>
          <div v-else :key="'empty'" class="today-popular-item">
            <span class="today-popular-title empty">오늘 작성된 인기글이 아직 없습니다.</span>
          </div>
        </Transition>
      </div>
    </section>

    <section class="board-header">
      <div class="breadcrumb">홈 &gt; 서울/경기 게시판</div>

      <div class="board-actions">
        <div class="search-actions">
          <div class="search-toolbar">
            <div class="search-box">
              <input v-model="query" type="text" placeholder="게시글 검색어를 입력하세요" />
              <button @click="applySearch">검색</button>
            </div>
          </div>

          <div class="write-actions">
            <button class="new-post" @click="openCreateModal">+ 글쓰기</button>

            <div class="category-menu">
              <button class="category-toggle" @click="toggleCategoryMenu">
                구분
                <span class="category-toggle-label">{{ getCategoryLabel(selectedCategory) }}</span>
              </button>

              <div v-if="showCategoryMenu" class="category-buttons">
                <button :class="{ active: selectedCategory === 'all' }" @click="selectCategory('all')">전체</button>
                <button :class="{ active: selectedCategory === 'festival' }" @click="selectCategory('festival')">축제</button>
                <button :class="{ active: selectedCategory === 'accommodation' }" @click="selectCategory('accommodation')">숙박</button>
                <button :class="{ active: selectedCategory === 'find' }" @click="selectCategory('find')">찾기</button>
                <button :class="{ active: selectedCategory === 'free' }" @click="selectCategory('free')">자유</button>
              </div>
            </div>

            <div class="tab-group">
              <button :class="{ active: selectedTab === 'all' }" @click="selectedTab = 'all'">전체</button>
              <button :class="{ active: selectedTab === 'popular' }" @click="selectedTab = 'popular'">인기글</button>
              <button :class="{ active: selectedTab === 'recycle' }" @click="selectedTab = 'recycle'">분리수거글</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <main class="board-table-wrap">
      <table class="board-table">
        <thead>
          <tr>
            <th style="width:80px">번호</th>
            <th style="width:100px">구분</th>
            <th>제목</th>
            <th style="width:120px">작성일</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in filteredPosts" :key="post.id" @click="openDetail(post.id)" style="cursor:pointer">
            <td>{{ post.seq }}</td>
            <td>
              <span class="category-badge">{{ getCategoryLabel(post.category) }}</span>
            </td>
            <td class="title-cell">{{ post.title }}</td>
            <td>{{ post.displayDate }}</td>
          </tr>
          <tr v-if="filteredPosts.length === 0">
            <td colspan="4" class="empty">작성된 게시글이 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </main>

    <footer class="pagination">
      <button @click="prevPage" :disabled="page === 1">&lt;</button>
      <button v-for="p in totalPages" :key="p" @click="page = p" :class="{ active: p === page }">{{ p }}</button>
      <button @click="nextPage" :disabled="page === totalPages">&gt;</button>
    </footer>

    <div v-if="showFormModal" class="modal-overlay" @click.self="closeFormModal">
      <div class="modal-card" role="dialog" aria-modal="true">
        <h3>{{ formMode === 'create' ? '새 글 작성' : '게시글 수정' }}</h3>

        <label>제목
          <input v-model="form.title" type="text" />
        </label>

        <label>내용
          <textarea v-model="form.content" rows="8"></textarea>
        </label>

        <div class="image-actions">
          <button type="button" class="image-upload-button" @click="triggerImageUpload">사진</button>
          <span v-if="form.imageName" class="image-name">{{ form.imageName }}</span>
        </div>

        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden-file-input"
          @change="handleImageUpload"
        />

        <img v-if="form.image" :src="form.image" class="image-preview" alt="첨부 이미지 미리보기" />

        <label>카테고리
          <select v-model="form.category">
            <option value="festival">축제</option>
            <option value="accommodation">숙박</option>
            <option value="find">찾기</option>
            <option value="free">자유</option>
          </select>
        </label>

        <label>비밀번호 (수정/삭제용)
          <input v-model="form.password" type="password" />
        </label>

        <div class="modal-actions">
          <button @click="submitForm">{{ formMode === 'create' ? '등록' : '저장' }}</button>
          <button class="secondary" @click="closeFormModal">취소</button>
        </div>

        <p class="msg" v-if="formMessage">{{ formMessage }}</p>
      </div>
    </div>

    <div v-if="showDetailModal" class="modal-overlay" @click.self="closeDetailModal">
      <div class="modal-card" role="dialog" aria-modal="true">
        <template v-if="!detailEditMode">
          <h3>{{ detailPost?.title }}</h3>
          <div class="meta">
            <span>작성일 {{ detailPost?.displayDate }}</span>
            <span v-if="detailPost?.updatedAt">수정일 {{ detailPost?.displayUpdatedAt }}</span>
          </div>
          <p class="content-text">{{ detailPost?.content }}</p>

          <img v-if="detailPost?.image" :src="detailPost.image" class="detail-image" alt="첨부 이미지" />

          <div class="vote-row">
            <button
              type="button"
              class="vote like"
              @click="votePost('like')"
              :disabled="Boolean(detailPost?.userVote)"
            >
              👍 추천 {{ detailPost?.likes ?? 0 }}
            </button>

            <button
              type="button"
              class="vote dislike"
              @click="votePost('dislike')"
              :disabled="Boolean(detailPost?.userVote)"
            >
              👎 비추천 {{ detailPost?.dislikes ?? 0 }}
            </button>

            <span class="vote-note" v-if="detailPost?.userVote">투표 완료</span>
          </div>

          <p class="msg" v-if="voteMessage">{{ voteMessage }}</p>

          <label>비밀번호 확인
            <input v-model="verifyPassword" type="password" placeholder="수정·삭제 비밀번호" />
          </label>

          <div class="modal-actions">
            <button @click="attemptStartEdit">수정</button>
            <button class="danger" @click="attemptDelete">삭제</button>
            <button class="secondary" @click="closeDetailModal">닫기</button>
          </div>
          <p class="msg" v-if="detailMessage">{{ detailMessage }}</p>
        </template>

        <template v-else>
          <h3>게시글 수정</h3>
          <label>제목
            <input v-model="form.title" type="text" />
          </label>

          <label>내용
            <textarea v-model="form.content" rows="8"></textarea>
          </label>

          <div class="image-actions">
            <button type="button" class="image-upload-button" @click="triggerImageUpload">사진</button>
            <span v-if="form.imageName" class="image-name">{{ form.imageName }}</span>
          </div>

          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden-file-input"
            @change="handleImageUpload"
          />

          <img v-if="form.image" :src="form.image" class="image-preview" alt="첨부 이미지 미리보기" />

          <label>카테고리
            <select v-model="form.category">
              <option value="festival">축제</option>
              <option value="accommodation">숙박</option>
              <option value="find">찾기</option>
              <option value="free">자유</option>
            </select>
          </label>

          <label>비밀번호 (현재 비밀번호와 동일하게 입력)
            <input v-model="form.password" type="password" />
          </label>

          <div class="modal-actions">
            <button @click="submitForm">저장</button>
            <button class="secondary" @click="cancelEdit">취소</button>
          </div>
          <p class="msg" v-if="formMessage">{{ formMessage }}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

const STORAGE_KEY = 'community-posts'
const VOTE_STORAGE_KEY = 'community-votes'

let rawData = null
try {
  rawData = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
} catch (e) {
  console.error('게시글 저장소 파싱 실패:', e)
  rawData = null
}

const RAW = rawData
let voteStorage = {}
try {
  voteStorage = JSON.parse(localStorage.getItem(VOTE_STORAGE_KEY) || '{}')
} catch (e) {
  console.error('투표 저장소 파싱 실패:', e)
  voteStorage = {}
}

const voteMap = ref(voteStorage)

watch(voteMap, (v) => {
  localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(v))
}, { deep: true })

const pad2 = (n) => String(n).padStart(2, '0')
const formatDisplay = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}`
}

const categoryLabelMap = {
  all: '전체',
  festival: '축제',
  accommodation: '숙박',
  find: '찾기',
  free: '자유'
}

function getCategoryLabel(category) {
  return categoryLabelMap[category] || '자유'
}

const normalizePosts = (posts) =>
  (Array.isArray(posts) ? posts : []).map((p) => ({
    ...p,
    likes: p.likes ?? 0,
    dislikes: p.dislikes ?? 0,
    userVote: p.userVote ?? null,
    category: ['festival', 'accommodation', 'find', 'free'].includes(p.category) ? p.category : 'free',
    image: p.image || '',
    imageName: p.imageName || ''
  }))

const readImageAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = () => reject(reader.error)
  reader.readAsDataURL(file)
})

const makeSample = () => {
  const now = new Date()
  return [
    { id: 7, title: '축제 일정 소식', content: '축제 관련 내용', password: 'pw7', createdAt: new Date(now.getTime() - 6 * 86400000).toISOString(), updatedAt: '', likes: 3, dislikes: 0, userVote: null, category: 'festival' },
    { id: 6, title: '숙박 추천 정보', content: '숙박 관련 내용', password: 'pw6', createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(), updatedAt: '', likes: 0, dislikes: 0, userVote: null, category: 'accommodation' },
    { id: 5, title: '분실물 찾기', content: '찾기 관련 내용', password: 'pw5', createdAt: new Date(now.getTime() - 4 * 86400000).toISOString(), updatedAt: '', likes: 1, dislikes: 0, userVote: null, category: 'find' },
    { id: 4, title: '자유롭게 이야기해요', content: '자유 게시글 내용', password: 'pw4', createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(), updatedAt: '', likes: 0, dislikes: 0, userVote: null, category: 'free' },
    { id: 3, title: '축제 후기', content: '축제 후기 내용', password: 'pw3', createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(), updatedAt: '', likes: 2, dislikes: 0, userVote: null, category: 'festival' },
    { id: 2, title: '숙소 정보 공유', content: '숙소 관련 내용', password: 'pw2', createdAt: new Date(now.getTime() - 1 * 86400000).toISOString(), updatedAt: '', likes: 0, dislikes: 0, userVote: null, category: 'accommodation' },
    { id: 1, title: '자유글', content: '자유글 내용', password: 'pw1', createdAt: now.toISOString(), updatedAt: '', likes: 0, dislikes: 0, userVote: null, category: 'free' }
  ]
}

const makeTempPosts = () => {
  const now = new Date()
  return [
    {
      id: 2001,
      title: '인기글 01',
      content: '추천 수가 10개인 인기글입니다.',
      password: 'pw2001',
      category: 'free',
      createdAt: now.toISOString(),
      updatedAt: '',
      likes: 10,
      dislikes: 0,
      userVote: null
    },
    {
      id: 2002,
      title: '인기글 02',
      content: '추천 수가 11개인 인기글입니다.',
      password: 'pw2002',
      category: 'free',
      createdAt: now.toISOString(),
      updatedAt: '',
      likes: 11,
      dislikes: 0,
      userVote: null
    },
    {
      id: 2003,
      title: '인기글 03',
      content: '추천 수가 12개인 인기글입니다.',
      password: 'pw2003',
      category: 'free',
      createdAt: now.toISOString(),
      updatedAt: '',
      likes: 12,
      dislikes: 0,
      userVote: null
    },
    {
      id: 2004,
      title: '인기글 04',
      content: '추천 수가 13개인 인기글입니다.',
      password: 'pw2004',
      category: 'free',
      createdAt: now.toISOString(),
      updatedAt: '',
      likes: 13,
      dislikes: 0,
      userVote: null
    },
    {
      id: 2005,
      title: '인기글 05',
      content: '추천 수가 14개인 인기글입니다.',
      password: 'pw2005',
      category: 'free',
      createdAt: now.toISOString(),
      updatedAt: '',
      likes: 14,
      dislikes: 0,
      userVote: null
    },
    {
      id: 2006,
      title: '인기글 06',
      content: '추천 수가 15개인 인기글입니다.',
      password: 'pw2006',
      category: 'free',
      createdAt: now.toISOString(),
      updatedAt: '',
      likes: 15,
      dislikes: 0,
      userVote: null
    },
    {
      id: 2007,
      title: '인기글 07',
      content: '추천 수가 16개인 인기글입니다.',
      password: 'pw2007',
      category: 'free',
      createdAt: now.toISOString(),
      updatedAt: '',
      likes: 16,
      dislikes: 0,
      userVote: null
    },
    {
      id: 2008,
      title: '인기글 08',
      content: '추천 수가 17개인 인기글입니다.',
      password: 'pw2008',
      category: 'free',
      createdAt: now.toISOString(),
      updatedAt: '',
      likes: 17,
      dislikes: 0,
      userVote: null
    },
    {
      id: 2009,
      title: '인기글 09',
      content: '추천 수가 18개인 인기글입니다.',
      password: 'pw2009',
      category: 'free',
      createdAt: now.toISOString(),
      updatedAt: '',
      likes: 18,
      dislikes: 0,
      userVote: null
    }
  ]
}

const existingPosts = Array.isArray(RAW) ? RAW : []
const basePosts = existingPosts.length > 0 ? existingPosts : makeSample()
const tempPosts = makeTempPosts()

const initialPosts = [
  ...basePosts,
  ...tempPosts.filter((temp) => !basePosts.some((p) => p.id === temp.id))
]

const rawPosts = ref(
  normalizePosts(initialPosts).map((p) => ({
    ...p,
    userVote: voteMap.value[p.id] || p.userVote || null
  }))
)

watch(rawPosts, (v) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
}, { deep: true })

const page = ref(1)
const perPage = 10
const query = ref('')
const selectedTab = ref('all')
const selectedCategory = ref('all')
const showCategoryMenu = ref(false)

let rotationTimer = null
const todayPopularIndex = ref(0)

const todayPopularPosts = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return rawPosts.value
    .filter((post) => {
      const createdAt = post.createdAt ? new Date(post.createdAt) : null
      if (!createdAt || Number.isNaN(createdAt.getTime())) return false

      const createdDate = new Date(
        createdAt.getFullYear(),
        createdAt.getMonth(),
        createdAt.getDate()
      )

      return createdDate.getTime() === today.getTime() && isPopularPost(post)
    })
    .sort((a, b) => {
      const likeDiff = Number(b.likes ?? 0) - Number(a.likes ?? 0)
      if (likeDiff !== 0) return likeDiff

      // 같은 추천수면 먼저 작성된 글 우선
      return new Date(a.createdAt) - new Date(b.createdAt)
    })
    .slice(0, 8)
})

const currentPopularPost = computed(() => {
  return todayPopularPosts.value[todayPopularIndex.value] || null
})

function advanceTodayPopular() {
  if (todayPopularPosts.value.length <= 1) return
  todayPopularIndex.value = (todayPopularIndex.value + 1) % todayPopularPosts.value.length
}

function startTodayPopularRotation() {
  if (rotationTimer) {
    window.clearInterval(rotationTimer)
  }

  if (todayPopularPosts.value.length > 1) {
    rotationTimer = window.setInterval(advanceTodayPopular, 5000)
  }
}

onMounted(() => {
  startTodayPopularRotation()
})

onBeforeUnmount(() => {
  if (rotationTimer) {
    window.clearInterval(rotationTimer)
    rotationTimer = null
  }
})

watch(todayPopularPosts, () => {
  todayPopularIndex.value = 0
  startTodayPopularRotation()
})

function toggleCategoryMenu() {
  showCategoryMenu.value = !showCategoryMenu.value
}

function selectCategory(category) {
  selectedCategory.value = category
  showCategoryMenu.value = false
}

function isPopularPost(post) {
  const likes = Number(post.likes ?? 0)
  return post.category === 'popular' || likes >= 10
}

function isRecyclePost(post) {
  const likes = Number(post.likes ?? 0)
  const dislikes = Number(post.dislikes ?? 0)
  return post.category === 'recycle' || (dislikes >= 10 && dislikes >= likes + 5)
}

const filteredAll = computed(() => {
  const q = query.value.trim().toLowerCase()

  const items = rawPosts.value
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((p, idx) => ({
      ...p,
      seq: rawPosts.value.length - idx,
      displayDate: formatDisplay(p.createdAt),
      displayUpdatedAt: p.updatedAt ? formatDisplay(p.updatedAt) : ''
    }))

  let tabItems = items

  if (selectedTab.value === 'popular') {
    tabItems = items.filter((p) => isPopularPost(p) && !isRecyclePost(p))
  } else if (selectedTab.value === 'recycle') {
    tabItems = items.filter((p) => isRecyclePost(p))
  } else {
    tabItems = items.filter((p) => !isRecyclePost(p))
  }

  const categoryItems =
    selectedCategory.value === 'all'
      ? tabItems
      : tabItems.filter((p) => p.category === selectedCategory.value)

  if (!q) return categoryItems
  return categoryItems.filter((p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredAll.value.length / perPage)))

const filteredPosts = computed(() => {
  page.value = Math.min(page.value, totalPages.value)
  const start = (page.value - 1) * perPage
  return filteredAll.value.slice(start, start + perPage)
})

function applySearch() {
  page.value = 1
}

const showFormModal = ref(false)
const formMode = ref('create')
const form = ref({
  id: null,
  title: '',
  content: '',
  password: '',
  category: 'free',
  image: '',
  imageName: ''
})
const formMessage = ref('')

const showDetailModal = ref(false)
const detailPostId = ref(null)
const detailEditMode = ref(false)
const verifyPassword = ref('')
const detailMessage = ref('')
const voteMessage = ref('')
const fileInputRef = ref(null)

function triggerImageUpload() {
  nextTick(() => {
    fileInputRef.value?.click()
  })
}

function handleImageUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return

  readImageAsDataUrl(file).then((dataUrl) => {
    form.value.image = dataUrl
    form.value.imageName = file.name
  })

  event.target.value = ''
}

function openCreateModal() {
  formMode.value = 'create'
  form.value = {
    id: null,
    title: '',
    content: '',
    password: '',
    category: 'free',
    image: '',
    imageName: ''
  }
  formMessage.value = ''
  showFormModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
  formMessage.value = ''
}

function submitForm() {
  if (!form.value.title.trim() || !form.value.content.trim() || !form.value.password.trim()) {
    formMessage.value = '모든 항목을 입력하세요.'
    return
  }

  if (formMode.value === 'create') {
    const now = new Date()
    const newPost = {
      id: Date.now(),
      title: form.value.title.trim(),
      content: form.value.content.trim(),
      password: form.value.password,
      category: form.value.category || 'free',
      image: form.value.image || '',
      imageName: form.value.imageName || '',
      createdAt: now.toISOString(),
      updatedAt: '',
      likes: 0,
      dislikes: 0,
      userVote: null
    }
    rawPosts.value.unshift(newPost)
    closeFormModal()
    page.value = 1
    return
  }

  const idx = rawPosts.value.findIndex((p) => p.id === form.value.id)
  if (idx === -1) {
    formMessage.value = '게시글을 찾을 수 없습니다.'
    return
  }

  if (rawPosts.value[idx].password !== form.value.password) {
    formMessage.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  rawPosts.value[idx] = {
    ...rawPosts.value[idx],
    title: form.value.title.trim(),
    content: form.value.content.trim(),
    password: form.value.password,
    category: form.value.category || 'free',
    image: form.value.image || rawPosts.value[idx].image || '',
    imageName: form.value.imageName || rawPosts.value[idx].imageName || '',
    updatedAt: new Date().toISOString()
  }

  formMessage.value = ''
  detailEditMode.value = false
  showFormModal.value = false
  showDetailModal.value = false
}

function openDetail(id) {
  detailPostId.value = id
  verifyPassword.value = ''
  detailMessage.value = ''
  voteMessage.value = ''
  detailEditMode.value = false
  showDetailModal.value = true
}

function closeDetailModal() {
  showDetailModal.value = false
  detailMessage.value = ''
  voteMessage.value = ''
  verifyPassword.value = ''
  detailEditMode.value = false
}

function attemptStartEdit() {
  if (!verifyPassword.value.trim()) {
    detailMessage.value = '비밀번호를 입력해주세요.'
    return
  }
  const p = detailPost.value
  if (!p) return
  if (p.password !== verifyPassword.value) {
    detailMessage.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  formMode.value = 'edit'
  form.value = {
    id: p.id,
    title: p.title,
    content: p.content,
    password: p.password,
    category: p.category || 'free',
    image: p.image || '',
    imageName: p.imageName || ''
  }
  formMessage.value = ''
  detailEditMode.value = true
}

function cancelEdit() {
  detailEditMode.value = false
  formMessage.value = ''
  verifyPassword.value = ''
}

function attemptDelete() {
  if (!verifyPassword.value.trim()) {
    detailMessage.value = '비밀번호를 입력해주세요.'
    return
  }
  const p = detailPost.value
  if (!p) return
  if (p.password !== verifyPassword.value) {
    detailMessage.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  rawPosts.value = rawPosts.value.filter((x) => x.id !== p.id)
  detailPostId.value = null
  showDetailModal.value = false
  verifyPassword.value = ''
}

function votePost(type) {
  const p = detailPost.value
  if (!p) return

  if (voteMap.value[p.id]) {
    voteMessage.value = '이미 투표한 게시글입니다.'
    return
  }

  const idx = rawPosts.value.findIndex((post) => post.id === p.id)
  if (idx === -1) return

  const current = rawPosts.value[idx]
  if (type === 'like') {
    current.likes += 1
  } else {
    current.dislikes += 1
  }
  current.userVote = type

  rawPosts.value[idx] = { ...current }
  voteMap.value[p.id] = type

  if (current.likes >= 10) {
    voteMessage.value = '추천 10회가 되어 인기글 탭에 표시됩니다.'
  } else if (current.dislikes >= 10 && current.dislikes >= current.likes + 5) {
    voteMessage.value = '비추천 10회·추천보다 5개 이상 많아 분리수거글 탭에 표시됩니다.'
  } else {
    voteMessage.value = type === 'like' ? '추천이 등록되었습니다.' : '비추천이 등록되었습니다.'
  }
}

function prevPage() {
  if (page.value > 1) page.value--
}

function nextPage() {
  if (page.value < totalPages.value) page.value++
}

const detailPost = computed(() => {
  const post = rawPosts.value.find((p) => p.id === detailPostId.value)
  if (!post) return null
  return {
    ...post,
    userVote: voteMap.value[post.id] || post.userVote || null,
    displayDate: formatDisplay(post.createdAt),
    displayUpdatedAt: post.updatedAt ? formatDisplay(post.updatedAt) : ''
  }
})
</script>

<style>
.page-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  color: #222;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
}

.region-nav {
  display: flex;
  gap: 10px;
}

.region-nav button,
.icon-search,
.new-post,
.search-box button,
.tab-group button,
.category-toggle {
  border: 1px solid #d1d5db;
  border-radius: 999px;
  background: white;
  padding: 10px 16px;
  cursor: pointer;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.board-actions {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 8px;
  flex: 1;
  width: 100%;
  margin-left: auto;
}

.search-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: auto;
  max-width: 340px;
}

.search-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
}

.search-box {
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 340px;
}

.search-box input {
  flex: 1 1 auto;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
}

.write-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.tab-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.category-menu {
  position: relative;
}

.category-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.category-toggle-label {
  color: #2563eb;
  font-weight: 600;
}

.category-buttons {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  z-index: 1000;
  min-width: 96px;
}

.category-buttons button {
  border: 1px solid #d1d5db;
  border-radius: 999px;
  background: white;
  padding: 8px 12px;
  cursor: pointer;
  white-space: nowrap;
}

.category-buttons button.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.board-table-wrap {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
}

.board-table {
  width: 100%;
  border-collapse: collapse;
}

.board-table th,
.board-table td {
  padding: 18px 16px;
  border-bottom: 1px solid #f3f4f6;
  text-align: left;
}

.board-table th {
  background: #f9fafb;
  font-weight: 600;
}

.board-table tbody tr:hover {
  background: #f8fafc;
}

.title-cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 720px;
}

.empty {
  text-align: center;
  color: #666;
  padding: 24px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
}

.pagination button {
  width: 38px;
  height: 38px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: white;
  cursor: pointer;
}

.pagination button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1200;
}

.modal-card {
  width: 720px;
  max-width: 100%;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.modal-card h3 {
  margin: 0 0 12px;
}

.modal-card label {
  display: block;
  margin-bottom: 12px;
  font-weight: 600;
}

.modal-card input,
.modal-card textarea,
.modal-card select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin-top: 8px;
  box-sizing: border-box;
}

.meta {
  display: flex;
  gap: 12px;
  color: #6b7280;
  margin-bottom: 12px;
  font-size: 0.95rem;
}

.content-text {
  white-space: pre-wrap;
  line-height: 1.6;
  margin-bottom: 18px;
}

.vote-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 16px;
}

.vote {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  color: white;
}

.vote.like {
  background: #10b981;
}

.vote.dislike {
  background: #ef4444;
}

.vote:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.vote-note {
  color: #6b7280;
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  justify-content: flex-end;
}

.modal-actions button {
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  background: #2563eb;
  color: white;
  cursor: pointer;
}

.modal-actions button.secondary {
  background: #f3f4f6;
  color: #111827;
  border: 1px solid #e5e7eb;
}

.modal-actions button.danger,
button.danger {
  background: #ef4444;
}

.msg {
  color: #b91c1c;
  margin-top: 8px;
}

.category-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 999px;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 0.85rem;
  font-weight: 600;
}

.image-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0 12px;
}

.image-upload-button {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.hidden-file-input {
  display: none;
}

.image-name {
  color: #6b7280;
  font-size: 0.9rem;
}

.image-preview {
  max-width: 100%;
  max-height: 220px;
  margin-top: 8px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}

.detail-image {
  max-width: 100%;
  max-height: 320px;
  margin-bottom: 16px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
  display: block;
}

.today-popular-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 12px 0 20px;
  padding: 18px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: linear-gradient(90deg, #f8fafc 0%, #eef2ff 100%);
}

.today-popular-section h2 {
  margin: 0;
  font-size: 1.1rem;
  color: #111827;
}

.today-popular-viewport {
  flex: 1;
  min-height: 32px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.today-popular-item {
  width: 100%;
}

.today-popular-title {
  font-weight: 600;
  color: #1d4ed8;
}

.today-popular-title.empty {
  color: #6b7280;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.today-popular-item-clickable {
  cursor: pointer;
}

.today-popular-item-clickable:hover .today-popular-title {
  text-decoration: underline;
}
</style>
