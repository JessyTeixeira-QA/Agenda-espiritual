// Arquivo: Navigation.test.jsx

// 1. Deno Test Utils
import { test, assertEquals } from "https://deno.land/std@0.219.0/testing/asserts.ts";
// 2. React Imports (Usando esm.sh para compatibilidade com Deno)
import React from "https://esm.sh/react@18.2.0"; 
import { renderToString } from "https://esm.sh/react-dom@18.2.0/server";

// 3. Importação do Componente
// Certifique-se de que a função Navigation está EXPORTADA no App.jsx!
import { Navigation } from './App.jsx'; 


test('Navigation component renders correctly and highlights the active path', () => {
    // Cenário de Teste: Rota Programação ('/programacao')
    const locationProgramacao = {
        pathname: '/programacao', 
    };
    
    // Renderização do componente usando React DOM Server
    const html = renderToString(<Navigation location={locationProgramacao} />);

    // Asserções (Verificações)
    
    // A classe para o link ativo (copiada do seu App.jsx)
    const activeClass = 'border-blue-500 text-gray-900';
    
    // 1. Verifica o título principal
    assertEquals(html.includes("Pioneira Auxiliar"), true, 
        "Erro: O título 'Pioneira Auxiliar' deve estar presente."
    );

    // 2. Verifica se a rota ativa ('Programação') tem a classe de destaque
    // Nota: A classe 'activeClass' deve aparecer APENAS no link da rota '/programacao'.
    const expectedActiveLink = `<a href="/programacao" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeClass}"`;
    
    assertEquals(
        html.includes(expectedActiveLink), 
        true,
        "Erro: A rota '/programacao' não está destacada corretamente."
    );
});