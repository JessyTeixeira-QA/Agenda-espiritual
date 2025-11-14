import { test, assertEquals } from "https://deno.land/std@0.219.0/testing/asserts.ts";
// Importamos o render para JSX (ajuste a versão do svelte_jsx se necessário)
import { render } from "https://deno.land/x/svelte_jsx@1.0.0/deno.ts"; 

// OBS: Ajuste este caminho se o seu componente Navigation não estiver neste local
// (No seu código original, a Navigation era uma função DENTRO de App.jsx)
import { Navigation } from './App.jsx'; 


test('Navigation component renders correctly and highlights the active path', () => {
    // 1. Cenário de Teste: Rota Início ('/')
    const locationHome = {
        pathname: '/', 
    };
    
    // 2. Renderização do componente
    const htmlHome = render(<Navigation location={locationHome} />);

    // 3. Asserções (Verificações)
    
    // A classe para o link ativo no seu código é: 'border-blue-500 text-gray-900'
    const activeClass = 'border-blue-500 text-gray-900';
    
    // Verifica se o título principal está presente
    assertEquals(htmlHome.includes("Pioneira Auxiliar"), true, 
        "Erro: O título 'Pioneira Auxiliar' deve estar presente."
    );

    // Verifica se a rota de 'Início' está destacada (usando a classe de ativo)
    // O teste procura um fragmento do link de 'Início' que contenha a classe ativa.
    const expectedActiveLink = `href="/" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeClass}"`;
    
    assertEquals(
        htmlHome.includes(expectedActiveLink), 
        true,
        "Erro: A rota '/' (Início) não está destacada corretamente."
    );
});