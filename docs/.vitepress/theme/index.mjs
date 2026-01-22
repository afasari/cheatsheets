import DefaultTheme from 'vitepress/theme'
import './style.css'
import { onMounted, h, nextTick } from 'vue'

export default {
  extends: DefaultTheme,
  setup() {
    onMounted(() => {
      nextTick(() => {
        addCopyButtons()
      })
    })
  }
}

function addCopyButtons() {
  const codeBlocks = document.querySelectorAll('.vp-code-group div[class*="language-"]')
  
  codeBlocks.forEach((block) => {
    if (block.querySelector('.copy-button')) return
    
    const button = document.createElement('button')
    button.className = 'copy-button'
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`
    button.setAttribute('aria-label', 'Copy to clipboard')
    
    button.addEventListener('click', async () => {
      const code = block.querySelector('code')
      const text = code?.innerText || ''
      
      try {
        await navigator.clipboard.writeText(text)
        button.classList.add('copied')
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
        
        setTimeout(() => {
          button.classList.remove('copied')
          button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`
        }, 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    })
    
    const wrapper = document.createElement('div')
    wrapper.className = 'code-block-wrapper'
    block.parentNode.insertBefore(wrapper, block)
    wrapper.appendChild(block)
    wrapper.appendChild(button)
  })
}
