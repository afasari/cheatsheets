<script setup>
import { ref, onMounted, computed, watch } from 'vue'

const props = defineProps({
  default: Object,
  required: true
})

const langLabels = {
  go: 'Go',
  rust: 'Rust',
  python: 'Python',
  javascript: 'JS'
}
const storageKey = 'leetcode-preferred-lang'

const activeLang = ref('go')
const codeContainer = ref(null)
const availableLangs = ref([])

onMounted(() => {
  detectCodeBlocks()
  const saved = localStorage.getItem(storageKey)
  if (saved && availableLangs.value.includes(saved)) {
    activeLang.value = saved
  }
})

const setActiveLang = (lang) => {
  activeLang.value = lang
  localStorage.setItem(storageKey, lang)
}

const detectCodeBlocks = () => {
  if (!codeContainer.value) return
  
  const blocks = codeContainer.value.querySelectorAll('[class*="language-"]')
  const langs = []
  
  blocks.forEach(block => {
    const classList = Array.from(block.classList)
    for (const cls of classList) {
      if (cls.startsWith('language-')) {
        const lang = cls.replace('language-', '').toLowerCase()
        if (!langs.includes(lang)) {
          langs.push(lang)
        }
        break
      }
    }
  })
  
  availableLangs.value = langs
}

const containerClass = computed(() => `active-lang-${activeLang.value}`)
</script>

<template>
  <div class="leetcode-code-tabs" :class="containerClass">
    <div class="tab-buttons">
      <button 
        v-for="lang in availableLangs" 
        :key="lang"
        :class="{ active: activeLang === lang }"
        @click="setActiveLang(lang)"
      >
        {{ langLabels[lang] || lang }}
      </button>
    </div>
    <div ref="codeContainer" class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.leetcode-code-tabs {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.tab-buttons {
  display: flex;
  gap: 2px;
  background-color: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 4px 4px 0 4px;
}

.tab-buttons button {
  padding: 8px 16px;
  background: none;
  border: none;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  cursor: pointer;
  color: var(--vp-c-text-2);
  font-weight: 500;
  transition: all 0.2s;
  border: 1px solid transparent;
  border-bottom: none;
}

.tab-buttons button:hover {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-soft-mute);
}

.tab-buttons button.active {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
  margin-bottom: -1px;
  padding-bottom: 9px;
}

.tab-content {
  background-color: var(--vp-c-bg);
  position: relative;
}

.tab-content :deep([class*="language-"]) {
  display: none;
  margin: 0;
  padding: 16px;
}

.leetcode-code-tabs.active-lang-go :deep([class*="language-go"]) {
  display: block;
}
.leetcode-code-tabs.active-lang-rust :deep([class*="language-rust"]) {
  display: block;
}
.leetcode-code-tabs.active-lang-python :deep([class*="language-python"]) {
  display: block;
}
.leetcode-code-tabs.active-lang-javascript :deep([class*="language-javascript"]) {
  display: block;
}

.tab-content :deep(pre) {
  margin: 0;
  padding: 0;
  border-radius: 0;
  background: transparent;
}

.tab-content :deep(code) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9em;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .tab-buttons {
    overflow-x: auto;
  }

  .tab-buttons button {
    white-space: nowrap;
    padding: 8px 12px;
    font-size: 0.9em;
  }
}
</style>